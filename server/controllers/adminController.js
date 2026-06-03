import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// @desc    Get admin dashboard stats and chart data
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Counts
    const totalUsers = await User.countDocuments({});
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
    
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // 2. Bookings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsByDate = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format bookings data for Recharts (e.g. { date: '2026-05-20', Bookings: 5, Revenue: 450 })
    const formattedBookingsData = bookingsByDate.map(item => ({
      date: item._id,
      Bookings: item.bookingsCount,
      Revenue: item.revenue
    }));

    // 3. User Growth (cumulative over time)
    const userGrowthByDate = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate cumulative user growth
    let runningTotal = 0;
    const formattedUserGrowthData = userGrowthByDate.map(item => {
      runningTotal += item.newUsers;
      return {
        date: item._id,
        'New Users': item.newUsers,
        'Total Users': runningTotal
      };
    });

    // 4. Popular Events
    const popularEventsAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: "$event",
          ticketsSold: { $sum: "$ticketQuantity" },
          revenue: { $sum: "$totalPrice" },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { ticketsSold: -1 } },
      { $limit: 5 }
    ]);

    // Populate event details manually to ensure reliability
    const formattedPopularEventsData = await Promise.all(
      popularEventsAgg.map(async (item) => {
        const event = await Event.findById(item._id).select('title category');
        return {
          id: item._id,
          title: event ? event.title : 'Deleted Event',
          category: event ? event.category : 'N/A',
          'Tickets Sold': item.ticketsSold,
          Revenue: item.revenue,
          Bookings: item.bookingsCount
        };
      })
    );

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalRevenue
      },
      charts: {
        bookingsData: formattedBookingsData,
        userGrowthData: formattedUserGrowthData,
        popularEventsData: formattedPopularEventsData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending event creator approval requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getEventCreationRequests = async (req, res, next) => {
  try {
    const users = await User.find({ eventCreationRequest: 'pending' }).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a user's request to create events
// @route   PUT /api/admin/requests/:id
// @access  Private/Admin
const updateEventCreationRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { status } = req.body;
      if (!['approved', 'rejected', 'pending', 'none'].includes(status)) {
        res.status(400);
        throw new Error('Invalid approval status');
      }
      
      user.eventCreationRequest = status;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        eventCreationRequest: updatedUser.eventCreationRequest
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getAdminStats, getEventCreationRequests, updateEventCreationRequest };
