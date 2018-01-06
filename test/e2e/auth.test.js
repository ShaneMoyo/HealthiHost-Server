const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');
const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/token-service');

describe('Auth API', () => {
  beforeEach(() => mongoose.connection.dropDatabase());

  let token = null; 
  beforeEach(()=>{
      const user = new User({
          email: 'test@test.com',
          firstName: 'first name',
          lastName: 'last name',
          roles: ['admin']
      });
      user.generateHash('password');
      return user.save()
          .then(user => tokenService.sign(user))
          .then(signed => token = signed );
  });

  it('Should generate a token on signup', () => {
    assert.ok(token);
  });

  it.skip('throws error if email already exists',() => {
    return request.post('/api/users')
        .set('Authorization', token)
        .send({
            email: 'teststaff@test.com',
            name: 'Test staff',
            password: 'password'
        })
        .then(
            () => { throw new Error('Unexpected successful response'); },
            err => {
                assert.equal(err.status, 400);
            }
        );
});

})