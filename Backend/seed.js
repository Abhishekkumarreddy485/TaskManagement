// run with: node seed.js (after installing deps and setting MONGO_URI in .env)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Task = require('./models/Task');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Task.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('password123', salt);

  const user = new User({ name: 'Demo User', email: 'demo@local.test', password: hash });
  await user.save();

  await Task.create([
    { user: user._id, title: 'First demo task' },
    { user: user._id, title: 'Second demo (completed)', completed: true }
  ]);

  console.log('Seeded demo user: demo@local.test / password123');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
