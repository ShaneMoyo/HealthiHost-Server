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
      .populate({ path: 'user', select: 'firstName lastName' })
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
  })

  .delete('/:id', ensureRole(['admin']), (req, res, next) => {
    return Appointment.findByIdAndRemove(req.params.id)
        .then(result => {
            const isRemoved = result ? true : false;
            return isRemoved; 
        })
        .then(isRemoved => res.json({ removed: isRemoved }))
        .catch(next);
});

