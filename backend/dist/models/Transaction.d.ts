import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, mongoose.DefaultSchemaOptions> & ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ITransaction>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map