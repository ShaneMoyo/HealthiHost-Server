const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('Appointments API', () => {

  let token = '';
  beforeEach(() => mongoose.connection.dropDatabase());
  beforeEach(() => {
    return request.post('/api/auth/')
      .send({
        email: 'test@test.com',
        firstName: 'first name',
        lastName: 'last name',
        roles: ['client'],
        password: 'password'
      })
      .then(({ body }) => token = body )
      })
  
  const testAppointments = [
    {
      service: 'Massage', 
      date: '1970-01-01',
      fulfilled: false
    },
    {
      service: 'Mineral', 
      date: '2015-05-21',
      fulfilled: true
    },
    {
      service: 'Movement', 
      date: '2010-01-21',
      fulfilled: false
    },
  ];

  it('Should save an appointment with an id', () => {
    return request.post('/api/appointments')
      .set('Authorization', token)
      .send(testAppointments[0])
      .then(({ body: savedAppointemnt }) => {
        assert.ok(savedAppointemnt._id);
        assert.equal(savedAppointemnt.date, testAppointments[0].date);
        assert.equal(savedAppointemnt.service, testAppointments[0].service);
        assert.equal(savedAppointemnt.fulfilled, testAppointments[0].fulfilled);
      });
  });


})