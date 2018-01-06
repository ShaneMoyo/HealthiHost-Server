const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('User model', () => {

  it('Should validate a good model', () => {
    const user = new User({
      email: 'test@test.com',
      firstName: 'first name',
      lastName: 'last name',
      hash: 'hash12345'
    });
    assert.equal(user.validateSync(), undefined);
  });

  it('Should throw error for missing fields', () => {
    const user = new User({});
    const { errors } = user.validateSync();
    assert.equal(errors.email.kind, 'required');
    assert.equal(errors.firstName.kind, 'required');
    assert.equal(errors.lastName.kind, 'required');
    assert.equal(errors.hash.kind, 'required');
  })
})