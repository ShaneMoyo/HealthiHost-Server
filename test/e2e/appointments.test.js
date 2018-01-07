const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('Appointments API', () => {

  let token = '';
  let admintoken = '';
  beforeEach(() => mongoose.connection.dropDatabase());
  beforeEach(() => {
    return Promise.all([
      request.post('/api/auth/')
        .send({
          email: 'test@test.com',
          firstName: 'first name',
          lastName: 'last name',
          roles: ['client'],
          password: 'password'
        })
        .then(({ body })  => token = body ),

      request.post('/api/auth')
        .send({
          email: 'admin@admin.com',
          firstName: 'first name',
          lastName: 'last name',
          roles: ['admin'],
          password: 'password'
        })
        .then(({ body })  => adminToken = body ),
      ]);
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
        assert.ok(savedAppointemnt.date);
        assert.equal(savedAppointemnt.service, testAppointments[0].service);
        assert.equal(savedAppointemnt.fulfilled, testAppointments[0].fulfilled);
      });
  });

  it('Should get all saved appointments with admin role', () => {
    const saveAppointemnts = testAppointments.map(appointment => {
      return request.post('/api/appointments')
        .set('Authorization', token)
        .send(appointment)
        .then(({ body: savedAppointemnt }) => savedAppointemnt)
    });

    return Promise.all(saveAppointemnts)
      .then(savedAppointemnts => {
        return request.get('/api/appointments')
          .set('Authorization', adminToken)
          .then(({ body: gotAppointemnts}) => {
            gotAppointemnts = gotAppointemnts.sort((a, b) => a._id < b._id);
            savedAppointemnts = saveAppointemnts.sort((a, b) => a._id < b._id);
            assert.deepEqual(savedAppointemnts, gotAppointemnts);
          });
      });
  })


})