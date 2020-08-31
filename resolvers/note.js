// Models
const Note = require('../models/Note');

module.exports = {
    notes: async() => {
        try {
            const notes = await Note.find().lean();
            return notes;
        } catch (error) {
            throw error;
        }
    },

    createNote: async(args) => {
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