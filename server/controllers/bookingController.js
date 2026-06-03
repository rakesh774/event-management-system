import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import QRCode from 'qrcode';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketQuantity } = req.body;

    // Find the event to check seats and price
    const event = await Event.findById(eventId);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    if (event.availableSeats < ticketQuantity) {
      res.status(400);
      throw new Error(`Only ${event.availableSeats} seats available`);
    }

    const totalPrice = event.price * ticketQuantity;

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      ticketQuantity,
      totalPrice,
    });

    const createdBooking = await booking.save();

    // Decrease available seats
    event.availableSeats -= ticketQuantity;
    await event.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event', 'title date location image');
    
    // Filter out bookings whose referenced event has been deleted
    const activeBookings = bookings.filter(booking => booking.event);
    
    // Generate QR codes for each active booking
    const bookingsWithQR = await Promise.all(activeBookings.map(async (booking) => {
      const qrData = JSON.stringify({ bookingId: booking._id, eventId: booking.event._id, user: req.user.name });
      const qrCodeImage = await QRCode.toDataURL(qrData);
      
      return {
        ...booking._doc,
        qrCodeImage
      };
    }));

    res.json(bookingsWithQR);
  } catch (error) {
    next(error);
  }
};

export { createBooking, getMyBookings };
