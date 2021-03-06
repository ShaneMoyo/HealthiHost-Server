const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth')();

const auth = require('./routes/auth');
const users = require('./routes/users');
const appointment = require('./routes/appointments');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/users', ensureAuth, users);
app.use('/api/appointments', ensureAuth, appointment)

app.use(errorHandler());

module.exports = app; 