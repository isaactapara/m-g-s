const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔗 Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, { 
      autoIndex: false,
      serverSelectionTimeoutMS: 10000 
    });
    console.log('🌱 Connected to MongoDB.');

    // REQUIRE MODELS AFTER CONNECT
    const User = require('../models/User');
    const MenuItem = require('../models/MenuItem');
    const bcrypt = require('bcryptjs'); // Needed for manual hashing
    mongoose.set('debug', true);

    await User.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🧹 Database cleared.');

    console.log('👤 Creating users...');
    const users = [
      { username: 'admin', pin: await bcrypt.hash('0000', 10), role: 'owner' },
      { username: 'cashier1', pin: await bcrypt.hash('1234', 10), role: 'cashier' }
    ];
    
    await User.collection.insertMany(users.map(u => ({ ...u, createdAt: new Date(), updatedAt: new Date() })));
    console.log('✅ Users created with hashed PINs');

    console.log('🥘 Creating menu items...');
    const menuData = [
      { name: 'Mandazi', price: 10, category: 'Snacks' },
      { name: 'Doughnut', price: 40, category: 'Snacks' },
      { name: 'Boiled eggs', price: 40, category: 'Snacks' },
      { name: 'Fried eggs', price: 70, category: 'Snacks' },
      { name: 'Spanish Omelette', price: 90, category: 'Snacks' },
      { name: 'Chapati', price: 20, category: 'Snacks' },
      { name: 'Samosa', price: 40, category: 'Snacks' },
      { name: 'Sausage', price: 50, category: 'Snacks' },
      { name: 'Smokie', price: 40, category: 'Snacks' },
      { name: 'Tea', price: 30, category: 'Hot Beverages' },
      { name: 'Black coffee', price: 40, category: 'Hot Beverages' },
      { name: 'White coffee', price: 50, category: 'Hot Beverages' },
      { name: 'Porridge', price: 40, category: 'Hot Beverages' },
      { name: 'Ugali cabbage/Sukuma', price: 140, category: 'Mains' },
      { name: 'Ugali manage', price: 160, category: 'Mains' },
      { name: 'Ugali Beef', price: 350, category: 'Mains' },
      { name: 'Ugali Mbuzi', price: 400, category: 'Mains' },
      { name: 'Ugali Kuku', price: 380, category: 'Mains' },
      { name: 'Ugali Matumbo', price: 300, category: 'Mains' },
      { name: 'Ugali maini', price: 340, category: 'Mains' },
      { name: 'Ugali mix', price: 220, category: 'Mains' },
      { name: 'Ugali mix kienyeji', price: 250, category: 'Mains' },
      { name: 'Chapo mix', price: 220, category: 'Mains' },
      { name: 'Chapo beef', price: 240, category: 'Mains' },
      { name: 'Chapo mbuzi', price: 290, category: 'Mains' },
      { name: 'Chapo kuku', price: 250, category: 'Mains' },
      { name: 'Chapo viazi', price: 140, category: 'Mains' },
      { name: 'Chapo beans', price: 140, category: 'Mains' },
      { name: 'Chapo ndengu', price: 150, category: 'Mains' },
      { name: 'Githeri', price: 130, category: 'Mains' },
      { name: 'Githeri mix', price: 150, category: 'Mains' },
      { name: 'Viazi/Ndengu beef', price: 350, category: 'Mains' },
      { name: 'Beef plain', price: 250, category: 'Mains' },
      { name: 'Beef fry', price: 300, category: 'Mains' },
      { name: 'Chips plain', price: 100, category: 'Mains' },
      { name: 'Chips masala', price: 200, category: 'Mains' },
      { name: 'Chips paprika', price: 150, category: 'Mains' },
      { name: 'Loaded fries', price: 400, category: 'Mains' }
    ];

    await MenuItem.insertMany(menuData);
    
    console.log('✅ Menu items seeded.');
    console.log('✨ Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.log('❌ Seeding Failed!');
    console.log('Error Name:', error.name);
    console.log('Message:', error.message);
    process.exit(1);
  }
};

seedData();
