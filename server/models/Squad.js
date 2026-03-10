import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    playerOut: {
        id: String,
        name: String,
        position: String,
        rating: Number,
        fee: Number
    },
    playerIn: {
        id: String,
        name: String,
        position: String,
        rating: Number,
        fee: Number
    },
    transferType: { type: String, enum: ['buy', 'sell', 'loan'], default: 'buy' }
}, { _id: false });

const squadSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    season: { type: Number, required: true },
    availableBudget: { type: Number, default: 0 },
    transfers: { type: [transferSchema], default: [] },
    totalTransferFee: { type: Number, default: 0 },
    avgTeamRating: { type: Number, default: 0 },
}, { timestamps: true });

squadSchema.index({ teamId: 1, season: 1 });
squadSchema.index({ userId: 1 });

export default mongoose.models.Squad || mongoose.model('Squad', squadSchema);
