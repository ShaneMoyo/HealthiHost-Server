const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth')();

const users = require('./routes/users');

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', users);

app.use(errorHandler());

module.exports = app; 