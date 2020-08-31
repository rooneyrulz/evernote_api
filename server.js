const express = require('express');
const { createServer } = require('http');
const dotenv = require('dotenv');
const logger = require('morgan');

// GRAPHQL
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require('colors');

// Load .ENV
dotenv.config({ path: './config/config.env' });

const app = express();
const server = createServer(app);

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

const notes = [];

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
          type Note {
            _id: ID
            title: String!
            content: String!
            private: Boolean!
            date: String!
          }

          input NoteInput {
            title: String!
            content: String!
            private: Boolean!
            date: String!
          }

          type RootQuery {
            notes: [Note!]!
          }
          
          type RootMutation {
            createNote(noteInput: NoteInput): Note
          }

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {
            notes: () => notes,

            createNote: (args) => {
                const newNote = {
                    title: args.noteInput.title,
                    content: args.noteInput.content,
                    private: args.noteInput.private,
                    date: args.noteInput.date,
                };
                notes.push(newNote);
                return newNote;
            },
        },
        graphiql: true,
    })
);

server.listen(process.env.PORT || 5000, () =>
    console.log(
        `Server running on ${process.env.NODE_ENV} port ${process.env.PORT || 5000}`
        .yellow
    )
);

module.exports = server;