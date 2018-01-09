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
                assert.equal(gotUsers.length, 2);
              })
    });

    it('Should get my user account with valid token', () => {
      return request.get('/api/auth/verify')
        .set('Authorization', token)
        .then(({ body: myUserId }) => {
          return request.get('/api/users/me')
            .set('Authorization', token)
            .then(({ body: gotAccount }) => gotAccount)
            .then( gotAccount => assert.equal(myUserId, gotAccount._id))
        })
    })
})