import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    id: String,
    name: String,
    club: String,
    country: String,
    rating: Number,
    position: String,
    image: String,
    tier: String,
    skills: [String],
    tags: [String],
}, { _id: false });

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leagueId: { type: String, required: true },
    badge: { type: String, default: null },
    stadium: { type: String, default: null },
    country: { type: String, default: '' },
    founded: { type: Date, default: Date.now },
    goalkeeper: { type: playerSchema, default: null },
    defenders: { type: [playerSchema], default: [] },
    midfielders: { type: [playerSchema], default: [] },
    forwards: { type: [playerSchema], default: [] },
    formation: { type: mongoose.Schema.Types.Mixed, default: null },
    selectedCaptain: { type: String, default: null },
    tacticsLayout: { type: mongoose.Schema.Types.Mixed, default: null },
    budget: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
}, { timestamps: true });

teamSchema.virtual('squadOverall').get(function () {
    const players = [
        this.goalkeeper,
        ...this.defenders,
        ...this.midfielders,
        ...this.forwards,
    ].filter(Boolean);
    if (!players.length) return 0;
    return Math.round(players.reduce((s, p) => s + (p.rating || 0), 0) / players.length);
});

teamSchema.index({ userId: 1, leagueId: 1 });

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
