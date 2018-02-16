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

  .get('/me', (req, res, next) => {
    Appointment.find({ user: req.user.id})
      .populate({ path: 'user', select: 'service date notes fulfilled'})
      .lean()
      .then(appointments => res.json(appointments))
      .catch(next);
  })

  .put('/me/:id', (req, res, next) => {
    const { id }= req.params;
    const { id: tokenId } = req.user;
    const { service, date, user: userId } = req.body;
    const isMe = tokenId === userId
    if (!id || !isMe ) {
      console.log('here', tokenId, userId )
      const error = !isMe ? 
        { code: 401, error: 'unauthorized'} : 
        { code: 404, error: `id ${id} does not exist`}
        next(err);
    }
    const update = { service, date }
    Appointment.findByIdAndUpdate({ _id: id }, update, { new: true , runValidators: true })
        .lean()
        .then(updatedAppointment => res.json(updatedAppointment));
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
  })

  .put('/:id', ensureRole(['admin', 'client']), (req, res, next) => {
    const { id } = req.params;
    const { body: update } = req
    if (!id) {
      next({ code: 404, error: `id ${id} does not exist`});
    }
    Appointment.findByIdAndUpdate({ _id: id }, update, { new: true , runValidators: true })
        .lean()
        .then(updatedAppointment => res.json(updatedAppointment));
  })

  

