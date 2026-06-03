import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  },
  ticketQuantity: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'confirmed' // confirmed, cancelled
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
