const authResolver = require('./auth');
const noteResolver = require('./note');

module.exports = {
    ...authResolver,
    ...noteResolver,
};