import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const matchResultSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    score: { type: Number, required: true },
    total: { type: Number, default: 5 },
    shooters: [{ name: String, position: String, rating: Number }],
    breakdown: [{
        outcome: { type: String, enum: ['goal', 'save', 'miss'] },
        power: Number,
        zone: String,
    }],
}, { _id: false });

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

const transferSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    playerOut: { name: String, position: String, rating: Number, fee: Number },
    playerIn: { name: String, position: String, rating: Number, fee: Number },
}, { _id: false });

const userSchema = new mongoose.Schema({
    // Authentication
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 24 },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    password: { type: String, required: true },

    // Profile Information
    displayName: { type: String, default: '' },
    profilePicture: { type: String, default: null },
    bio: { type: String, default: '' },
    country: { type: String, default: '' },

    // Verification
    emailVerified: { type: Boolean, default: false },

    // Career state
    userName: { type: String, default: '' },
    selectedLeague: { type: String, default: null },
    selectedTeam: { type: mongoose.Schema.Types.Mixed, default: null },
    selectedManager: { type: mongoose.Schema.Types.Mixed, default: null },
    formation: { type: mongoose.Schema.Types.Mixed, default: null },
    goalkeeper: { type: playerSchema, default: null },
    defenders: { type: [playerSchema], default: [] },
    midfielders: { type: [playerSchema], default: [] },
    forwards: { type: [playerSchema], default: [] },
    selectedCaptain: { type: String, default: null },

    // Season data
    budget: { type: Number, default: 0 },
    transfers: { type: [transferSchema], default: [] },
    matchHistory: { type: [matchResultSchema], default: [] },

    // Teams managed by user
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    activeTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },

    // Tactics board custom layout (overrides default formation positions)
    tacticsLayout: { type: mongoose.Schema.Types.Mixed, default: null },

    // Preferences
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'en' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Methods
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

// Computed OVR
userSchema.virtual('squadOvr').get(function () {
    const players = [
        this.goalkeeper,
        ...this.defenders,
        ...this.midfielders,
        ...this.forwards,
    ].filter(Boolean);
    if (!players.length) return 0;
    return Math.round(players.reduce((s, p) => s + (p.rating || 0), 0) / players.length);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
