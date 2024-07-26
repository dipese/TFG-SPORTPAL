import mongoose from "mongoose";
import z from "zod";

const teamSchemaZod = z.object({
    name: z.string(),
    elo: z.number(),
});

const teamShchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    elo: {
        type: Number,
        required: true,
    },
    players: {
        type: Array,
        required: false,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: true,
    },
    requests: {
        type: Array,
        required: false,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    events: {
        type: Array,
        required: false,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Events',
        },
    },
    
});

teamShchema.statics.validateTeam = (teamData) => {
    return teamSchemaZod.parse(teamData);
}

export default mongoose.model('Team', teamShchema);
