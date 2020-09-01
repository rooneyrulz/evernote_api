// Models
const Note = require('../models/Note');

// Helpers
const { getUser } = require('../helpers');

module.exports = {
    notes: async(req) => {
        try {
            const notes = await Note.find().populate('creator').lean();
            return notes;
        } catch (error) {
            throw error;
        }
    },

    createNote: async(args, req) => {
        if (!req.isAuth) throw new Error('Unauthorized!');
        const { title, content, private } = args.noteInput;
        try {
            const newNote = await new Note({
                title,
                content,
                private,
                creator: req.user,
            }).save();
            return {
                ...newNote._doc,
                _id: newNote.id,
                creator: getUser(req.user),
            };
        } catch (error) {
            throw error;
        }
    },
};