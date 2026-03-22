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

  let formattedPhone = phone;
  if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.slice(1)}`;
  if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

  try {
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    // PREVENT DUPLICATE PUSHES
    if (bill.status === 'PAID') {
      return res.status(400).json({ message: 'This bill is already paid' });
    }
    
    // Allow retry if status is NOT 'PENDING' or if it's already failed/cancelled
    if (bill.checkoutRequestId && bill.status === 'PENDING') {
       return res.status(400).json({ message: 'A payment request is already active for this bill.' });
    }

    const token = await generateToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(bill.total),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://mg-restaurant-callback.loca.lt/api/payments/callback',
      AccountReference: `MG-${billId.slice(-4)}`,
      TransactionDesc: 'MG Restaurant Hub Payment'
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await Bill.findByIdAndUpdate(billId, { checkoutRequestId: response.data.CheckoutRequestID });
    res.json(response.data);
  } catch (error) {
    console.error('STK Push Error:', JSON.stringify(error.response?.data || error.message, null, 2));
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment', error: error.response?.data });
  }
};

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

      // REGEX EXTRACTOR: Final fallback if meta tags are missing
      const extractIdFromText = (text) => {
          if (!text) return null;
          const match = text.match(/[A-Z0-9]{10}/); // Look for 10-char alphanumeric codes (UCM...)
          return match ? match[0] : null;
      };

      const mpesaReceipt = getMeta('MpesaReceiptNumber') || getMeta('MpesaReceiptNo') || getMeta('ReceiptNo') || getMeta('TransactionID') || extractIdFromText(callbackData.ResultDesc);
      const mpesaPhone = getMeta('PhoneNumber');
      const actualAmountPaid = Number(getMeta('Amount'));
      const rawDate = getMeta('TransactionDate');

      // 1. Fetch the original bill to verify the total (Audit)
      const pendingBill = await Bill.findOne({ checkoutRequestId });
      
      if (!pendingBill) {
        console.error(`Bill not found for Request ID: ${checkoutRequestId}`);
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
        console.log(`🚨 FRAUD ATTEMPT: Bill ${pendingBill.billNumber} paid ${actualAmountPaid} instead of ${pendingBill.total}`);
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
      console.log(`✅ Payment verified. Receipt: ${mpesaReceipt}`);
    } else {
      const resultDesc = callbackData.ResultDesc;
      await Bill.findOneAndUpdate(
        { checkoutRequestId }, 
        { status: 'FAILED', failureReason: resultDesc }, 
        { returnDocument: 'after' }
      );
      console.log(`❌ Payment failed: ${resultDesc}`);
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

    // Handle Query Results
    if (String(ResultCode) === '0') {
      // It was successful. 
      const billAfterUpdate = await Bill.findById(billId);
      
      // FALLBACK ID RECOVERY: Extract from text description if ID is missing
      const extractedId = ResultDesc.match(/[A-Z0-9]{10}/) ? ResultDesc.match(/[A-Z0-9]{10}/)[0] : null;

      if (billAfterUpdate.status !== 'PAID' || (extractedId && !billAfterUpdate.mpesaReceiptNumber)) {
        billAfterUpdate.status = 'PAID';
        if (extractedId) billAfterUpdate.mpesaReceiptNumber = extractedId;
        await billAfterUpdate.save();
      }
      return res.json({ status: 'PAID', bill: billAfterUpdate, message: 'Payment confirmed' });
    }
 else if (ResultCode === '1032') {
      await Bill.findByIdAndUpdate(billId, { status: 'CANCELLED', failureReason: 'Request cancelled by user' });
      return res.json({ status: 'CANCELLED' });
    } else if (ResultCode === '1037') {
      return res.json({ status: 'PENDING', message: 'Timeout. Result not yet available' });
    } else {
      await Bill.findByIdAndUpdate(billId, { status: 'FAILED', failureReason: ResultDesc });
      return res.json({ status: 'FAILED', message: ResultDesc });
    }

  } catch (error) {
    console.error('Status Query Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to query M-Pesa status' });
  }
};

module.exports = { initiateSTKPush, handleCallback, checkTransactionStatus };
