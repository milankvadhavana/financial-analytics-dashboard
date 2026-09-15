import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  id: { type: Number, required: true, unique: true },
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true, index: true },
  category: { 
    type: String, 
    enum: ['Revenue', 'Expense'], 
    required: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending'], 
    required: true,
    index: true 
  },
  user_id: { type: String, required: true, index: true },
  user_profile: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for common query patterns
TransactionSchema.index({ date: -1, category: 1 });
TransactionSchema.index({ status: 1, category: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);