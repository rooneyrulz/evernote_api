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

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
          type RootQuery {}
          
          type RootMutation {}

          schema {
            query: RootQuery
            mutation: RootMutation
          }
        `),
        rootValue: {},
    })
);

server.listen(process.env.PORT || 5000, () =>
    console.log(
        `Server running on ${process.env.NODE_ENV} port ${process.env.PORT || 5000}`
        .yellow
    )
);

module.exports = server;