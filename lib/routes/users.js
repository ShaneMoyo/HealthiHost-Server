const router = require('express').Router(); 
const User = require('../models/user');
const ensureRole = require('../../lib/utils/ensure-role')

module.exports = router

.get('/', ensureRole(['admin']), (req, res, next) => {
  User.find()
    .select('-hash')
    .lean()
    .then(users => res.json(users))
    .catch(next);
})