const router = require('express').Router(); 
const Appointment = require('../models/appointment');
const ensureRole = require('../../lib/utils/ensure-role')

module.exports = router 

  .post('/',(req, res, next) => {
    req.body.user = req.user.id
    new Appointment(req.body).save()
      .then(appointment => res.json(appointment))
      .catch(next);
  })

  .get('/', ensureRole(['admin']), (req, res, next) => {
    Appointment.find()
      .populate({ path: 'user', select: 'firstName' })
      .lean()
      .then(appointments => res.json(appointments))
      .catch(next);
  })

  .get('/:id', ensureRole(['admin']), (req, res, next) => {
    Appointment.findById(req.params.id)
      .populate({ path: 'user', select: 'firstName lastName' })
      .lean()
      .then(appointments => res.json(appointments))
      .catch(next);
  });

