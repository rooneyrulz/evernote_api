// Models
const Note = require('../models/Note');
const User = require('../models/User');

exports.getUser = async(id) => {
    try {
        const user = await User.findById(id).lean();
        return user;
    } catch (error) {
        throw error;
    }
};

exports.getNotes = async(id) => {
    try {
        const notes = await Note.find({ creator: id }).lean();
        return notes;
    } catch (error) {
        throw error;
    }
};