const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');
const User = require('../../lib/models/user');
const tokenService = require('../../lib/utils/token-service');


describe('Auth API', () => {
  beforeEach(() => mongoose.connection.dropDatabase());

  it('Should generate a token on signup', () => {
    return request.post('/api/auth')
        .send({ 
            email: 'test@test.com',
            firstName: 'first name',
            lastName: 'last name',
            roles: ['admin'],
            password: 'password'
            
        })
        .then(({ body: token }) => assert.ok(token))
  });

  it('throws error if email already exists',() => {
    return request.post('/api/auth')
        .send({ 
            email: 'test@test.com',
            firstName: 'first name',
            lastName: 'last name',
            roles: ['user'],
            password: 'password'
        })
        .then(()=> {
            return request.post('/api/auth')
                .send({
                    email: 'test@test.com',
                    firstName: 'first name',
                    lastName: 'last name',
                    roles: ['user'],
                    password: 'password'
                })
                .then(
                    () => { throw new Error('Unexpected successful response'); },
                    err => {
                        assert.equal(err.status, 400);
                    }
                );
        });
  });

  it('Should throw an error if password is not included', () => {
    return request.post('/api/auth')
        .send({ 
            email: 'test2@test.com',
            firstName: 'first name',
            lastName: 'last name',
            roles: ['admin'],
            password: ''
        })
        .then(
            () => { throw new Error('Unexpected successful response'); },
            err => {
                assert.equal(err.status, 400);
            }
        );       
  });

  it('Should signin with valid credentials', () => {
    return request.post('/api/auth')
    .send({ 
        email: 'test@test.com',
        firstName: 'first name',
        lastName: 'last name',
        roles: ['user'],
        password: 'password'
    })
    .then(()=> {
    return request
        .post('/api/auth/signin')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .then(({ body: token }) => {
            assert.isOk(token);
        });   
    });       
  });

})