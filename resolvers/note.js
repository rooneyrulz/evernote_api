// Models
const Note = require('../models/Note');

module.exports = {
    notes: async(req) => {
        if (!req.isAuth) throw new Error('Unauthorized!');
        try {
            const notes = await Note.find().lean();
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
            }).save();
            return newNote;
        } catch (error) {
            throw error;
        }
    },
};