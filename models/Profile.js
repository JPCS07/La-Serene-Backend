const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    executive: {
        type: String
    },
    superiorKing: {
        type: String
    },
    superiorQueen: {
        type: String
    },
    king: {
        type: String
    },
    queen: {
        type: String
    },
    deluxe: {
        type: String
    },
    date: {
    type: Date,
    default: Date.now
    }
});

module.exports = mongoose.model('profile', ProfileSchema);