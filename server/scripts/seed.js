import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const events = [
  {
    title: "Global Tech Summit 2026",
    category: "Technology",
    location: "San Francisco, CA",
    date: new Date("2026-10-15T09:00:00Z"),
    price: 299,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    description: "The premier conference for technology professionals. Join over 5,000 attendees for 3 days of inspiring keynotes, technical workshops, and unparalleled networking opportunities. Discover the latest trends in AI, Web3, and cloud architecture.",
    availableSeats: 150,
    totalSeats: 5000,
    featured: true
  },
  {
    title: "Symphony Under the Stars",
    category: "Music",
    location: "New York, NY",
    date: new Date("2026-07-22T19:30:00Z"),
    price: 85,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    description: "Experience a magical evening as the Philharmonic Orchestra performs classic and contemporary pieces outdoors in Central Park. Bring a blanket, enjoy gourmet food trucks, and lose yourself in the music.",
    availableSeats: 420,
    totalSeats: 2000,
    featured: true
  },
  {
    title: "Startup Pitch Competition",
    category: "Business",
    location: "Austin, TX",
    date: new Date("2026-08-10T13:00:00Z"),
    price: 0,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
    description: "Watch the most promising early-stage startups pitch their ideas to a panel of top-tier venture capitalists. Network with founders, investors, and industry leaders in the heart of Texas.",
    availableSeats: 45,
    totalSeats: 300,
    featured: true
  },
  {
    title: "Modern Art Exhibition",
    category: "Arts & Culture",
    location: "Online",
    date: new Date("2026-06-05T10:00:00Z"),
    price: 15,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    description: "A breathtaking virtual tour of contemporary art pieces from emerging global artists. Participate in live Q&A sessions with the creators and purchase exclusive digital pieces.",
    availableSeats: 1000,
    totalSeats: 5000,
    featured: false
  },
  {
    title: "DevRelCon 2026",
    category: "Technology",
    location: "London, UK",
    date: new Date("2026-11-05T08:30:00Z"),
    price: 199,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    description: "The definitive conference for Developer Relations, Community Management, and Developer Experience professionals. Learn how to build thriving developer communities.",
    availableSeats: 80,
    totalSeats: 800,
    featured: false
  },
  {
    title: "Global Food Festival",
    category: "Food & Drink",
    location: "Chicago, IL",
    date: new Date("2026-09-12T11:00:00Z"),
    price: 45,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
    description: "Taste dishes from over 50 countries, attend masterclasses by Michelin-starred chefs, and enjoy live cultural performances all weekend long.",
    availableSeats: 1500,
    totalSeats: 5000,
    featured: false
  }
];

const users = [
  {
    name: "dex",
    email: "dex@gmail.com",
    password: "dex",
    isAdmin: true,
    interests: ["Technology", "Music"],
    eventCreationRequest: "approved"
  },
  {
    name: "Admin User",
    email: "admin@eventmaster.com",
    password: "password123",
    isAdmin: true,
    interests: ["Technology", "Business"],
    eventCreationRequest: "approved"
  },
  {
    name: "Regular User",
    email: "user@eventmaster.com",
    password: "password123",
    isAdmin: false,
    interests: ["Music", "Food & Drink"],
    eventCreationRequest: "none"
  }
];

const importData = async () => {
  try {
    await Event.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    const createdUsers = [];
    // Create users one by one to ensure the pre-save password hash hooks are fired
    for (const userData of users) {
      const u = await User.create(userData);
      createdUsers.push(u);
    }

    const adminUser = createdUsers[0];
    const sampleEvents = events.map(event => {
      return { ...event, createdBy: adminUser._id, isApproved: true };
    });

    await Event.insertMany(sampleEvents);

    console.log('Data Imported! (Users and Events seeded, no initial bookings)');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroy data logic if needed
} else {
  importData();
}
