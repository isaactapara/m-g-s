const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    console.log('Connecting to:', "mongodb://127.0.0.1:27017/M&G's");
    await mongoose.connect("mongodb://127.0.0.1:27017/M&G's");
    console.log('Connected!');
    
    console.log('Hashing...');
    const hash = await bcrypt.hash('0000', 10);
    console.log('Hash:', hash);
    
    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.log('ERROR:', err.message);
    process.exit(1);
  }
}
test();
