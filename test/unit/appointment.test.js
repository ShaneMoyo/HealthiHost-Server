const assert = require('chai').assert; 
const Appointment = require('../../lib/models/appointment');


describe('Appointments Model', () => {

  it('Should validate a good model', () => {
    const appointment = new Appointment({
      service: 'Massage', 
      user: '5a51421479c4f4070443f281',
      date: '1970-01-01',
      fulfilled: false
    });
    assert.equal(appointment.validateSync(), undefined)
  });

  it('Should throw error for missing fields', () => {
    const appointment = new Appointment({});
    const { errors } = appointment.validateSync();
    assert.equal(errors.service.kind, 'required');
    assert.equal(errors.user.kind, 'required');
    assert.equal(errors.date.kind, 'required');
    assert.equal(errors.fulfilled.kind, 'required');
  });

  it('Should throw errors for incorrect data types', () => {
    const appointment = new Appointment({
        service: {},
        user: {},
        date: {},
        fulfilled: {}
    });
    const { errors } = appointment.validateSync();
    assert.equal(errors.service.kind, 'String');
    assert.equal(errors.user.kind, 'ObjectID');
    assert.equal(errors.date.kind, 'Date');
    assert.equal(errors.fulfilled.kind, 'Boolean');
  });
})