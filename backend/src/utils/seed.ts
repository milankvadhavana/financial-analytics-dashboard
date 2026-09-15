import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial';

/**
 * Try several likely locations for the sample data file.
 * First match wins.
 */
function findSampleDataFile(): string {
  const candidates = [
    // Preferred: inside backend/data/
    path.resolve(__dirname, '../../data/transactions.json'),
    // Legacy names in same folder
    path.resolve(__dirname, '../../data/transactions (1).json'),
    // Project root
    path.resolve(__dirname, '../../../transactions.json'),
    path.resolve(__dirname, '../../../transactions (1).json'),
    // Current working directory (where npm run was invoked)
    path.resolve(process.cwd(), 'transactions.json'),
    path.resolve(process.cwd(), 'transactions (1).json'),
    path.resolve(process.cwd(), 'data/transactions.json'),
    // Backend root
    path.resolve(process.cwd(), '../transactions.json'),
    path.resolve(process.cwd(), '../transactions (1).json'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  console.error('\n❌ Could not find the sample data file.');
  console.error('   Searched these locations:');
  candidates.forEach((p) => console.error(`     - ${p}`));
  console.error('\n👉 Fix: move your file to backend/data/transactions.json');
  throw new Error('Sample data file not found');
}

async function seed() {
  try {
    console.log(`🔌 Connecting to ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ Connected to database: ${mongoose.connection.name}`);

    console.log('🧹 Clearing existing data...');
    await Transaction.deleteMany({});
    await User.deleteMany({});

    const jsonPath = findSampleDataFile();
    console.log(`📄 Using sample data: ${jsonPath}`);

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const transactions = JSON.parse(raw);
    console.log(`📦 Parsed ${transactions.length} transactions`);

    const docs = transactions.map((t: any) => ({
      id: t.id,
      date: new Date(t.date),
      amount: t.amount,
      category: t.category,
      status: t.status,
      user_id: t.user_id,
      user_profile: t.user_profile,
    }));

    // ordered: false → continue inserting even if a duplicate id appears
    await Transaction.insertMany(docs, { ordered: false });
    console.log(`✅ Inserted transactions into "financial" DB`);

    await User.create({
      name: 'Demo Analyst',
      email: 'demo@example.com',
      password: 'password123',
      role: 'analyst',
    });
    console.log('✅ Demo user created: demo@example.com / password123');

    const txCount = await Transaction.countDocuments();
    const userCount = await User.countDocuments();
    console.log(`\n📊 Database summary:`);
    console.log(`   Transactions: ${txCount}`);
    console.log(`   Users: ${userCount}`);

    await mongoose.disconnect();
    console.log('\n✨ Seeding complete.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();