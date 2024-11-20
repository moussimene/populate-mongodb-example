const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBURL = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(mongoDBURL);
    console.log('MongoDB connection established successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

main().catch((err) => console.log(err));
