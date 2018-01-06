const connect = require( '../../lib/connect');
const mongoose = require( 'mongoose');
const url = 'mongodb://localhost:27017/Healthihost-test';

before(()=> connect(url));
after(()=> mongoose.connection.close());

