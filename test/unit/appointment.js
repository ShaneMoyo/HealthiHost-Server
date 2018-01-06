const assert = require('chai').assert; 
const Appointment = require('../../lib/models/appointment');

describe('Appointments API', () => {
  it('Should validate a good model', () => {
    const appointment = new Appointment({
      service: 'Massage', 
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
      },
      date: {
        type: Date,
        required: true
      },
      fulfilled: Boolean
    });
    assert.equal(appointment.validateSync(), undefined)
  });

  
})