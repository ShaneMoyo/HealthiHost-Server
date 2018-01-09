const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe.only('Users API', () => {

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

    it('Should get all users with admin role', () => {
          return request.get('/api/users')
            .set('Authorization', adminToken)
            .then(({ body: gotUsers}) => {
              gotUsers = gotUsers.sort((a, b) => a._id < b._id);
              savedUsers = savedUsers.sort((a, b) => a._id < b._id);
              savedUsers.forEach((savedUser, i) => {
                assert.deepEqual(savedUser._id, gotUsers[i]._id);
              })
            });
    });
  
})