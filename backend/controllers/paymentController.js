const axios = require('axios');
const Bill = require('../models/Bill');

const getTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${date}${hours}${minutes}${seconds}`;
};

const getPassword = (timestamp) => {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const rawString = shortcode + passkey + timestamp;
  return Buffer.from(rawString).toString('base64');
};

let cachedToken = null;
let tokenExpiry = null;

const generateToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return cachedToken; // Return cached token if valid (5 min buffer)
  }

  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  
  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );
  
  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + ((response.data.expires_in || 3599) * 1000);
  
  return cachedToken;
};

const initiateSTKPush = async (req, res) => {
  const { phone, amount, billId } = req.body;
  if (!phone || !amount || !billId) return res.status(400).json({ message: 'Missing required fields' });

  let formattedPhone = String(phone).trim();
  if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.slice(1)}`;
  if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);
  
  console.log(`🚀 Initiating STK Push for ${formattedPhone} (Amt: ${amount}, Bill: ${billId})`);

  try {
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    // PREVENT DUPLICATE PUSHES
    if (bill.status === 'PAID') {
      return res.status(400).json({ message: 'This bill is already paid' });
    }
    
    // Allow retry if status is NOT 'PENDING' or if it's already failed/cancelled
    // Allow retry after 1 minute if stuck in PENDING
    const isRecentlyAttempted = bill.checkoutRequestId && 
                               bill.status === 'PENDING' && 
                               (new Date() - new Date(bill.updatedAt)) < 60000;

    if (isRecentlyAttempted) {
       return res.status(400).json({ message: 'A payment request is already active. Please wait 60 seconds.' });
    }

    const token = await generateToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);

    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://fancy-toes-nail.loca.lt/api/payments/callback';
    console.log(`📡 Using Callback URL: ${callbackUrl}`);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(bill.total),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `MG-${billId.slice(-4)}`,
      TransactionDesc: 'MG Restaurant Hub Payment'
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 45000 // 45s to handle slow sandbox
      }
    );

    await Bill.findByIdAndUpdate(billId, { checkoutRequestId: response.data.CheckoutRequestID });
    res.json(response.data);
  } catch (error) {
    const errorData = error.response?.data;
    console.error('STK Push Error:', JSON.stringify(errorData || error.message, null, 2));

    // Specific Handling for Rate Limits / Spike Arrests
    const errorMessage = errorData?.errorMessage || errorData?.message || "";
    if (errorMessage.includes('SpikeArrest') || errorData?.errorCode === '400.002.02') {
      return res.status(429).json({ 
        message: 'M-Pesa system is cooling down. Please wait 10 seconds before retrying.',
        code: 'RATE_LIMIT'
      });
    }

    if (errorMessage.includes('Duplicate') || errorMessage.includes('AlreadyProcessed')) {
       return res.status(409).json({ 
         message: 'A similar transaction is already underway. Please wait a moment while we complete your initial request.',
         code: 'DUPLICATE_REQUEST'
       });
    }

    res.status(500).json({ 
      message: 'Failed to initiate M-Pesa payment', 
      error: errorData,
      customerMessage: errorData?.customerMessage || 'M-Pesa Gateway is currently busy. Please try again.'
    });
  }
};

// --- GLOBAL HELPERS ---
const parseMpesaDate = (dateStr) => {
  if (!dateStr || String(dateStr).length < 14) return new Date();
  const s = String(dateStr);
  try {
    const year = parseInt(s.slice(0, 4));
    const month = parseInt(s.slice(4, 6)) - 1;
    const day = parseInt(s.slice(6, 8));
    const hours = parseInt(s.slice(8, 10));
    const minutes = parseInt(s.slice(10, 12));
    const seconds = parseInt(s.slice(12, 14));
    return new Date(year, month, day, hours, minutes, seconds);
  } catch (e) {
    return new Date();
  }
};

const extractIdFromText = (text) => {
    if (!text) return null;
    const match = text.match(/[A-Z0-9]{10}/i); 
    const found = match ? match[0].toUpperCase() : null;
    if (found === 'SUCCESSFUL') return null; // Safe guard against sandbox status word
    return found;
};

const handleCallback = async (req, res) => {
  console.log('--- M-PESA CALLBACK RECEIVED ---', JSON.stringify(req.body, null, 2));

  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      console.error('Invalid payload structure received from Safaricom');
      return res.status(400).json({ message: 'Invalid Payload' });
    }

    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    if (Number(resultCode) === 0) {
      const callbackMetadata = callbackData.CallbackMetadata?.Item || [];
      const getMeta = (name) => {
          const item = callbackMetadata.find(i => String(i.Name).toLowerCase() === name.toLowerCase());
          return item ? item.Value : null;
      };


      const mpesaReceipt = getMeta('MpesaReceiptNumber') || getMeta('MpesaReceiptNo') || getMeta('ReceiptNo') || getMeta('TransactionID') || extractIdFromText(callbackData.ResultDesc) || extractIdFromText(JSON.stringify(req.body));
      const mpesaPhone = getMeta('PhoneNumber');
      const actualAmountPaid = Number(getMeta('Amount'));
      const rawDate = getMeta('TransactionDate');

      // 1. Fetch the original bill (Linkage)
      let pendingBill = await Bill.findOne({ checkoutRequestId });
      
      if (!pendingBill && Number(resultCode) === 0) {
        // [AUDIT] ORPHAN RECOVERY: If initiation timed out OR query was faster than webhook
        console.log(`[?] Orphan/Stale callback for ${checkoutRequestId}. Attempting fuzzy match...`);
        const phoneMatch = mpesaPhone;
        const amountMatch = actualAmountPaid;
        
        if (phoneMatch && amountMatch) {
          pendingBill = await Bill.findOne({
            $or: [
              { status: 'PENDING' },
              { status: 'PAID', mpesaReceiptNumber: { $eq: null } },
              { status: 'PAID', mpesaReceiptNumber: "" },
              { status: 'PAID', mpesaReceiptNumber: { $exists: false } }
            ],
            total: { $gte: amountMatch - 1, $lte: amountMatch + 2 },
            updatedAt: { $gt: new Date(Date.now() - 1200000) } // Extended to 20 mins for sandbox lag
          }).sort({ updatedAt: -1 });

          if (pendingBill) {
            console.log(`✅ Fuzzy matched orchid callback to Bill ${pendingBill.billNumber} (Current Status: ${pendingBill.status})`);
            pendingBill.checkoutRequestId = checkoutRequestId;
            await pendingBill.save();
          }
        }
      }

      if (!pendingBill) {
        console.warn(`[!] No bill found for Request ID ${checkoutRequestId} even after fuzzy match.`);
        return res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
      }

      // 2. The Security Audit: Prevent the "One Shilling" Exploit
      if (Math.round(Number(pendingBill.total)) !== Math.round(actualAmountPaid)) {
        await Bill.findOneAndUpdate(
          { checkoutRequestId }, 
          { 
            status: 'PARTIAL_PAYMENT_FLAGGED',
            mpesaReceiptNumber: mpesaReceipt,
            amountPaid: actualAmountPaid,
            failureReason: `FRAUD ALERT: Expected ${pendingBill.total}, Received ${actualAmountPaid}`
          }
        );
        console.log(`FRAUD ATTEMPT: Bill ${pendingBill.billNumber} paid ${actualAmountPaid} instead of ${pendingBill.total}`);
        return res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
      }

      // 3. Success Path: Validated Amount & Receipt
      await Bill.findOneAndUpdate(
        { checkoutRequestId }, 
        { 
          status: 'PAID',
          mpesaReceiptNumber: mpesaReceipt,
          paymentPhone: mpesaPhone,
          amountPaid: actualAmountPaid,
          mpesaTransactionDate: parseMpesaDate(rawDate)
        }, 
        { returnDocument: 'after' }
      );
      console.log(`Payment verified. Receipt: ${mpesaReceipt}`);
    } else {
      const resultDesc = callbackData.ResultDesc;
      await Bill.findOneAndUpdate(
        { checkoutRequestId }, 
        { status: 'FAILED', failureReason: resultDesc }, 
        { returnDocument: 'after' }
      );
      console.log(`Payment failed: ${resultDesc}`);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error('Callback payload processing error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkTransactionStatus = async (req, res) => {
  const { billId } = req.body;
  if (!billId) return res.status(400).json({ message: 'Bill ID is required' });

  try {
    const bill = await Bill.findById(billId);
    if (!bill || !bill.checkoutRequestId) {
      return res.status(404).json({ message: 'Transaction record not found' });
    }

    // If already paid or failed, return early
    if (bill.status !== 'PENDING') {
      return res.json({ status: bill.status, bill });
    }

    const token = await generateToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: bill.checkoutRequestId
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { ResultCode, ResultDesc } = response.data;
    console.log(`🔍 STK Query Full Response for ${billId}:`, JSON.stringify(response.data, null, 2));

    const code = String(ResultCode);

    // Terminal Success
    if (code === '0') {
      const extractedId = extractIdFromText(ResultDesc);
      
      if (extractedId) {
        const updatedBill = await Bill.findByIdAndUpdate(billId, { 
          status: 'PAID',
          mpesaReceiptNumber: extractedId
        }, { returnDocument: 'after' });
        return res.json({ status: 'PAID', bill: updatedBill });
      }
      
      const existingBill = await Bill.findById(billId);
      if (existingBill.mpesaReceiptNumber) {
        existingBill.status = 'PAID';
        await existingBill.save();
        return res.json({ status: 'PAID', bill: existingBill });
      }

      existingBill.status = 'PAID';
      await existingBill.save();
      return res.json({ status: 'SUCCESS_PENDING_ID', bill: existingBill });
    }

    // Terminal Failures (Instant Feedback)
    // We strictly wait for '0' (Success) or known "Waiting" codes
    const waitingCodes = ['1037', 'CESS-1', 'CESS-3', '2001']; 
    if (code !== '0' && !waitingCodes.includes(code)) {
      console.log(`❌ Fail-Fast Triggered (Code ${code}): ${ResultDesc}`);
      const failedBill = await Bill.findByIdAndUpdate(billId, { 
        status: 'FAILED', 
        failureReason: ResultDesc 
      }, { returnDocument: 'after' });
      return res.json({ status: 'FAILED', bill: failedBill });
    }

    // If Code is in waitingCodes, we stay PENDING
    return res.json({ status: 'PENDING', message: 'Waiting for PIN...' });

  } catch (error) {
    const errorData = error.response?.data;
    if (errorData?.detail?.errorcode?.includes('ratelimit') || error.response?.status === 429) {
      console.log(`[!] Safaricom Rate Limit hit for Bill ${req.body.billId}. Silencing with PENDING return.`);
      return res.status(200).json({ status: 'PENDING', message: 'M-Pesa system busy, retrying...' });
    }
    console.error('Status Query Error:', errorData || error.message);
    res.status(500).json({ message: 'Failed to query M-Pesa status' });
  }
};

module.exports = { initiateSTKPush, handleCallback, checkTransactionStatus };
