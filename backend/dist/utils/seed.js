"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const User_1 = __importDefault(require("../models/User"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial';
async function seed() {
    try {
        console.log(`🔌 Connecting to ${MONGODB_URI}...`);
        await mongoose_1.default.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`✅ Connected to database: ${mongoose_1.default.connection.name}`);
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Transaction_1.default.deleteMany({});
        await User_1.default.deleteMany({});
        // Load transaction JSON file
        // Adjust path if your JSON file is located elsewhere
        const jsonPath = path_1.default.resolve(__dirname, '../../../transactions (1).json');
        if (!fs_1.default.existsSync(jsonPath)) {
            throw new Error(`Sample data file not found at: ${jsonPath}\n` +
                `Place "transactions (1).json" at the project root or update jsonPath.`);
        }
        const raw = fs_1.default.readFileSync(jsonPath, 'utf-8');
        const transactions = JSON.parse(raw);
        console.log(`📄 Loaded ${transactions.length} transactions from JSON`);
        // Insert transactions (cast date strings to Date)
        const docs = transactions.map((t) => ({
            id: t.id,
            date: new Date(t.date),
            amount: t.amount,
            category: t.category,
            status: t.status,
            user_id: t.user_id,
            user_profile: t.user_profile,
        }));
        await Transaction_1.default.insertMany(docs, { ordered: false });
        console.log(`✅ Inserted ${docs.length} transactions into "financial" DB`);
        // Create demo user (password auto-hashed by User model)
        await User_1.default.create({
            name: 'Demo Analyst',
            email: 'demo@example.com',
            password: 'password123',
            role: 'analyst',
        });
        console.log('✅ Demo user created: demo@example.com / password123');
        // Final counts
        const txCount = await Transaction_1.default.countDocuments();
        const userCount = await User_1.default.countDocuments();
        console.log(`\n📊 Database summary:`);
        console.log(`   Transactions: ${txCount}`);
        console.log(`   Users: ${userCount}`);
        await mongoose_1.default.disconnect();
        console.log('\n✨ Seeding complete.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seed failed:', error.message);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map