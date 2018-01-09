const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('Users API', () => {

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
  
})