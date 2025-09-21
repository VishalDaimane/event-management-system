const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial admin user
    await seedAdminUser();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  try {
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: 'admin@eventmanagement.com' });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await User.create({
        name: 'System Administrator',
        email: 'admin@eventmanagement.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      
      console.log('🔑 Admin user created: admin@eventmanagement.com / admin123');
    }
  } catch (error) {
    console.log('Error seeding admin user:', error.message);
  }
};

module.exports = connectDB;
