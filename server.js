const express = require('express');
const { createServer } = require('http');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const logger = require('morgan');
require('colors');

// SCHEMA & RESOLVER
const schema = require('./schema');
const rootResolver = require('./resolvers');

// AUTH MIDDLEWARE
const isAuth = require('./middleware/auth');

// LOAD .ENV
dotenv.config({ path: './config/config.env' });

const app = express();
const server = createServer(app);

// MONGO CONNECTION
require('./config/db')(server);

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: rootResolver,
        graphiql: true,
    })
);

module.exports = server;