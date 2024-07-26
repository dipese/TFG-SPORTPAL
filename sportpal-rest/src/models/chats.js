import { message } from "antd";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }],
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false,
    },
});

export default mongoose.model('Chat', chatSchema);