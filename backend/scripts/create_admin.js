require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@eker.local';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eker-ai-db';

async function run() {
  try {
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected. Creating/Updating admin user:', email);

    const hashed = await bcrypt.hash(password, 10);
    const update = { $set: { password: hashed, role: 'admin', lastLogin: new Date() }, $setOnInsert: { createdAt: new Date(), email } };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, update, opts);
    console.log('Admin user ready:', { email: user.email, role: user.role });
    console.log('Password (store this safely):', password);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
