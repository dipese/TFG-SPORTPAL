import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    team: {
        type: Boolean,
        required: true,
    },
});

export default mongoose.model('Sport', sportSchema);

