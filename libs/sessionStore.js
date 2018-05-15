const mongooseStore = require('koa-session-mongoose');
const mongoose = require('../models/mongoose.js');

module.exports = new mongooseStore({
    collection: 'appSessions',
    connection: mongoose,
    expires: 86400, // 1 day is the default
    name: 'AppSession'
})