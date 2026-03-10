import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema({
    outcome: { type: String, enum: ['goal', 'save', 'miss'], required: true },
    power: Number,
    zone: String,
    player: String,
    minute: Number,
}, { _id: false });

const matchSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opponentTeam: { type: String, required: true },
    league: { type: String, required: true },
    season: { type: Number, required: true },
    matchDate: { type: Date, default: Date.now },
    stadium: { type: String, default: '' },
    goals: { type: Number, required: true },
    opponentGoals: { type: Number, required: true },
    result: { type: String, enum: ['win', 'draw', 'loss'], required: true },
    totalShots: { type: Number, default: 0 },
    shotsOnTarget: { type: Number, default: 0 },
    possession: { type: Number, default: 0 },
    playerPerformances: [{
        playerId: String,
        playerName: String,
        position: String,
        rating: Number,
        goals: Number,
        assists: Number,
    }],
    breakdown: { type: [breakdownSchema], default: [] },
    pointsEarned: { type: Number, default: 0 },
    reward: { type: Number, default: 0 },
}, { timestamps: true });

matchSchema.index({ teamId: 1, userId: 1 });
matchSchema.index({ matchDate: -1 });

export default mongoose.models.Match || mongoose.model('Match', matchSchema);
