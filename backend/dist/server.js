"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial';
async function bootstrap() {
    try {
        // Optional: enable query logging in dev
        if (process.env.NODE_ENV !== 'production') {
            mongoose_1.default.set('debug', false); // set true to log all queries
        }
        console.log(`🔌 Connecting to MongoDB at ${MONGODB_URI}...`);
        await mongoose_1.default.connect(MONGODB_URI, {
            // These options prevent long hangs if MongoDB is down
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.name}`);
        console.log(`   Host: ${mongoose_1.default.connection.host}:${mongoose_1.default.connection.port}`);
        // Handle connection events
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB error:', err.message);
        });
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`   Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('❌ Startup failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('  1. Is MongoDB running? (mongosh or Compass)');
        console.error('  2. Is the URI correct? Check backend/.env');
        console.error('  3. Port 27017 in use by another process?');
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('\n🔌 MongoDB connection closed (SIGINT)');
    process.exit(0);
});
bootstrap();
//# sourceMappingURL=server.js.map