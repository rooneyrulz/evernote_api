const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true,
    },
    createdNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
    }, ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);