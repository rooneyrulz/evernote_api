const express = require('express');
const { createServer } = require('http');
const dotenv = require('dotenv');
const logger = require('morgan');
const mongoose = require('mongoose');

// GRAPHQL
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require('colors');

// MODELS
const Note = require('./models/Note');

// Load .ENV
dotenv.config({ path: './config/config.env' });

const app = express();
const server = createServer(app);

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
          type Note {
            _id: ID!
            title: String!
            content: String!
            private: Boolean!
            creator: User!
            date: String!
          }

          type User {
            _id: ID!
            email: String!
            password: String
            createdNotes: [Note!]
            date: String!
          }

          input NoteInput {
            title: String!
            content: String!
            private: Boolean!
          }

          input UserInput {
            email: String!
            password: String!
          }

          type RootQuery {
            notes: [Note!]!
          }
          
          type RootMutation {
            createNote(noteInput: NoteInput): Note
            createUser(userInput: UserInput): User
          }

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {
            notes: async() => {
                try {
                    const notes = await Note.find().lean();
                    return notes;
                } catch (error) {
                    throw error;
                }
            },

            createNote: async(args) => {
                try {
                    const newNote = await new Note({
                        title: args.noteInput.title,
                        content: args.noteInput.content,
                        private: args.noteInput.private,
                    }).save();
                    return newNote;
                } catch (error) {
                    throw error;
                }
            },

            createUser: async() => {},
        },
        graphiql: true,
    })
);

async function initMongoConnection() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        if (conn.connection) {
            console.log(
                `mongo connection established on ${conn.connection.host} ${conn.connection.port}..`
                .inverse.cyan
            );
            server.listen(process.env.PORT || 5000, () =>
                console.log(
                    `Server running on ${process.env.NODE_ENV} port ${
            process.env.PORT || 5000
          }..`.yellow
                )
            );
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

initMongoConnection();

module.exports = server;