import Event from '../models/Event.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const category = req.query.category && req.query.category !== 'All Categories' 
      ? { category: req.query.category } 
      : {};

    const location = req.query.location && req.query.location !== 'Anywhere'
      ? req.query.location === 'Online' 
        ? { location: 'Online' }
        : { location: { $regex: req.query.location, $options: 'i' } }
      : {};

    // By default, only show approved events unless includePending is true (for admin views)
    const filter = { ...keyword, ...category, ...location };
    if (req.query.includePending !== 'true') {
      filter.isApproved = true;
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    // Enforce permission checks: Must be admin OR an approved event creator
    if (!req.user.isAdmin && req.user.eventCreationRequest !== 'approved') {
      res.status(403);
      throw new Error('Not authorized to create events. Awaiting admin approval.');
    }

    const { title, category, location, date, price, image, description, availableSeats, totalSeats, featured } = req.body;

    const event = new Event({
      title, 
      category, 
      location, 
      date, 
      price, 
      image, 
      description, 
      availableSeats, 
      totalSeats, 
      featured,
      createdBy: req.user._id,
      isApproved: req.user.isAdmin ? true : false // Admin events are auto-approved
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
  try {
    const { title, category, location, date, price, image, description, availableSeats, totalSeats, featured } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      // Enforce ownership: Must be the creator OR admin to edit
      if (event.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to modify this event');
      }

      event.title = title || event.title;
      event.category = category || event.category;
      event.location = location || event.location;
      event.date = date || event.date;
      event.price = price !== undefined ? price : event.price;
      event.image = image || event.image;
      event.description = description || event.description;
      event.availableSeats = availableSeats !== undefined ? availableSeats : event.availableSeats;
      event.totalSeats = totalSeats !== undefined ? totalSeats : event.totalSeats;
      event.featured = featured !== undefined ? featured : event.featured;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Enforce ownership: Must be the creator OR admin to delete
      if (event.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to modify this event');
      }

      await Event.deleteOne({ _id: event._id });
      res.json({ message: 'Event removed' });
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get live suggestions for search
// @route   GET /api/events/suggestions
// @access  Public
const getEventSuggestions = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.json([]);
    }

    const suggestions = await Event.find({
      isApproved: true,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ]
    })
    .select('title category location image')
    .limit(6);

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI recommendations for user
// @route   GET /api/events/recommendations
// @access  Public (Optional auth)
const getEventRecommendations = async (req, res, next) => {
  try {
    // Optional Authentication to get personalized preferences
    let user = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        // Continue without user if token fails
      }
    }

    // Get categories of events this user has already booked, to avoid recommending booked events
    let bookedCategories = [];
    let userBookedEventIds = [];
    if (user) {
      const userBookings = await Booking.find({ user: user._id, status: 'confirmed' }).populate('event', 'category');
      userBookedEventIds = userBookings.map(b => b.event ? b.event._id.toString() : '');
      bookedCategories = userBookings.map(b => b.event ? b.event.category : '').filter(Boolean);
    }

    // Viewed categories from query param
    const viewedQuery = req.query.viewed || '';
    const viewedCategories = viewedQuery.split(',').filter(Boolean);
    const viewedCounts = {};
    viewedCategories.forEach(cat => {
      viewedCounts[cat] = (viewedCounts[cat] || 0) + 1;
    });

    // Get top 10 popular events based on ticket sales
    const popularEventsAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: "$event",
          ticketsSold: { $sum: "$ticketQuantity" }
        }
      },
      { $sort: { ticketsSold: -1 } },
      { $limit: 10 }
    ]);
    const popularEventIds = popularEventsAgg.map(pe => pe._id.toString());

    // Fetch all upcoming approved events
    const upcomingEvents = await Event.find({ date: { $gte: new Date() }, isApproved: true });

    // Score events
    const scoredEvents = upcomingEvents.map(event => {
      const eventIdStr = event._id.toString();
      
      // Exclude already booked events
      if (userBookedEventIds.includes(eventIdStr)) {
        return { event, score: -1 };
      }

      let score = 0;

      // 1. User interests (explicit preferences)
      if (user && user.interests && user.interests.includes(event.category)) {
        score += 5;
      }

      // 2. Booking history categories
      if (bookedCategories.includes(event.category)) {
        score += 3;
      }

      // 3. Recently viewed categories (implicit preferences)
      if (viewedCounts[event.category]) {
        score += 2 * viewedCounts[event.category];
      }

      // 4. Global popularity
      const popIndex = popularEventIds.indexOf(eventIdStr);
      if (popIndex !== -1) {
        score += (10 - popIndex) * 0.5; // Top popular events get up to 5 points
      }

      // 5. Featured flag
      if (event.featured) {
        score += 1.5;
      }

      return { event, score };
    });

    // Filter, sort and slice recommendations
    let recommendations = scoredEvents
      .filter(item => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.event);

    // If we have fewer than 6, fill with upcoming events not already recommended or booked
    if (recommendations.length < 6) {
      const recommendedIds = recommendations.map(r => r._id.toString());
      const extraEvents = upcomingEvents.filter(e => 
        !recommendedIds.includes(e._id.toString()) && 
        !userBookedEventIds.includes(e._id.toString())
      );
      recommendations.push(...extraEvents.slice(0, 6 - recommendations.length));
    } else {
      recommendations = recommendations.slice(0, 6);
    }

    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventSuggestions, getEventRecommendations };
