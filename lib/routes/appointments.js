const router = require('express').Router(); 
const Appointment = require('../models/appointment');

module.exports = router 

  .post('/',(req, res, next) => {
    req.body.user = req.user.id
    new Appointment(req.body).save()
      .then(appointment => res.json(appointment))
      .catch(next);
  })