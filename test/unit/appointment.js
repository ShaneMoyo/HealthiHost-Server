const assert = require('chai').assert; 
const Appointment = require('../../lib/models/appointment');



describe('Appointments API', () => {
  //working on saving an appointment
  it('Should validate a good model', () => {
    const appointment = new Appointment({
      service: 'Massage', 
      user: '5a51421479c4f4070443f281',
      date: '1970-01-01',
      fulfilled: false
    });
    assert.equal(appointment.validateSync(), undefined)
  });


})