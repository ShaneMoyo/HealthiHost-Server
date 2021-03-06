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
            savedAppointemnts = savedAppointemnts.sort((a, b) => a._id < b._id);
            savedAppointemnts.forEach((savedAppointemnt, i) => {
              assert.deepEqual(savedAppointemnt._id, gotAppointemnts[i]._id);
            })
          });
      });
  });

  it('Should get a appointment by id with admin token', () => {
    return request.post('/api/appointments')
      .set('Authorization', token)
      .send(testAppointments[0])
      .then(({ body: savedAppointemnt }) => {
        return request.get(`/api/appointments/${savedAppointemnt._id}`)
          .set('Authorization', adminToken)
          .then(({ body: gotAppointemnt }) => {
            assert.deepEqual(gotAppointemnt._id, savedAppointemnt._id)
          })
      });
  })

  it('Should delete an appointment with admin token', () => {
    return request.post('/api/appointments')
    .set('Authorization', token)
    .send(testAppointments[0])
    .then(({ body: savedAppointemnt }) => {
      return request.delete(`/api/appointments/${savedAppointemnt._id}`)
        .set('Authorization', adminToken)
    })
    .then(({ body: deleteResponse }) => {
        return request.get('/api/appointments')
          .set('Authorization', adminToken)
          .then(({ body: gotAppointemnts}) => {
            assert.deepEqual(gotAppointemnts, []);
          });  
    });
  });

  it('Should update(limited) my appointment by id', () => {
      return request.post('/api/appointments')
          .set('Authorization', token)
          .send(testAppointments[0])
          .then(({ body: savedAppointemnt }) => savedAppointemnt)
          .then(savedAppointemnt => {
              testAppointments[1].user = savedAppointemnt.user;
              return request.put(`/api/appointments/me/${savedAppointemnt._id}`)
                  .set('Authorization', token)
                  .send(testAppointments[1]);
          })
          .then(({ body: updatedAppointemnt }) => {
              assert.deepEqual(updatedAppointemnt.service, testAppointments[1].service);
              assert.deepEqual(updatedAppointemnt.fulfilled, testAppointments[0].fulfilled);
          });
  });

  it('Should get my appointments', () => {
    return Promise.all([
      request.post('/api/appointments')
        .set('Authorization', token)
        .send(testAppointments[0])
        .then(({ body: savedAppointemnt }) => savedAppointemnt),
      request.post('/api/appointments')
        .set('Authorization', adminToken)
        .send(testAppointments[1])
        .then(({ body: savedAppointemnt }) => savedAppointemnt),
    ])
      .then(savedAppointemnts => {
        return request.get('/api/appointments/me')
          .set('Authorization', token)
          .then(({ body: gotAppointemnts}) => {
            assert.deepEqual(savedAppointemnts[0]._id, gotAppointemnts[0]._id);
            assert.equal(gotAppointemnts.length, 1)
          });
      });
  });

  it('Should update an appointment by id with admin token', () => {
    return request.post('/api/appointments')
        .set('Authorization', token)
        .send(testAppointments[0])
        .then(({ body: savedAppointemnt }) => savedAppointemnt)
        .then(savedAppointemnt => {
            return request.put(`/api/appointments/${savedAppointemnt._id}`)
                .set('Authorization', adminToken)
                .send(testAppointments[1]);
        })
        .then(({ body: updatedAppointemnt }) => {
            assert.deepEqual(updatedAppointemnt.service, testAppointments[1].service);
            assert.deepEqual(updatedAppointemnt.fulfilled, testAppointments[1].fulfilled);
        });
});






})