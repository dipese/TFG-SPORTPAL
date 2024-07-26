import mongoose from "mongoose";
import z from "zod";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: {
            locDescription: {
                type: String,
                required: true,
            },
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participante1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    participante2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    equipo1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    equipo2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    sport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
        required: true,
    },
    result: {
        puntuacionParticipante1: {
            type: Number,
        },
        puntuacionParticipante2: {
            type: Number,
        },
    }

});

export default mongoose.model("Event", eventSchema);