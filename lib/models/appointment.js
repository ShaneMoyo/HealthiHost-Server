const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ischema = new Schema({ 
    service: {
      type: String,
      required: true,
      enum: ['Massage', 'Mineral', 'Movement']
    }, 
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
    date: {
      type: String,
      required: true
    },
    fulfilled: {
      type: Boolean,
      required: true
    },
    notes: String,
    cancelled: Boolean

});

module.exports = mongoose.model('Appointment', ischema);