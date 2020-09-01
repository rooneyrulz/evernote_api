const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

// MODELS
const User = require('../models/User');

// Helpers
const { getNotes } = require('../helpers');

module.exports = {
    createUser: async(args) => {
        const { email, password } = args.userInput;
        try {
            const user = await User.findOne({ email }).exec();
            if (user)
                return new Error(
                    'Email is already in use, Use different email instead'
                );
            const hashedPwd = await hash(password, 12);
            if (!hashedPwd)
                return new Error('Something went wrong hashing the password');
            const newUser = await new User({
                email,
                password: hashedPwd,
            }).save();
            const token = sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: 360000,
            });
            return {
                token,
                user: {
                    ...newUser._doc,
                    _id: newUser.id,
                    createdNotes: getNotes(newUser.id),
                },
            };
        } catch (error) {
            throw error;
        }
    },

    loginUser: async(args) => {
        const { email, password } = args.userInput;
        try {
            const user = await User.findOne({ email }).exec();
            if (!user) return new Error('User not found, Create new user..');
            const isMatch = await compare(password, user.password);
            if (!isMatch) return new Error('Invalid Credentials');
            const token = sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: 360000,
            });
            return {
                token,
                user: {
                    ...user._doc,
                    _id: user.id,
                    createdNotes: getNotes(user.id),
                },
            };
        } catch (error) {
            throw error;
        }
    },
};