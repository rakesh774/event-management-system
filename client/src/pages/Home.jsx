import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import EventCard from '../components/ui/EventCard';
import { events } from '../data/events';

const Home = () => {
  // Get only featured events for home page
  const featuredEvents = events.filter(event => event.featured).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-200/50 dark:bg-primary-900/20 blur-3xl w-[800px] h-[800px]" />
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-200/50 dark:bg-blue-900/20 blur-3xl w-[600px] h-[600px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8"
          >
            Discover and manage <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
              extraordinary events
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10"
          >
            The all-in-one platform for creating, managing, and promoting your next big event. Seamless experience for both organizers and attendees.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/events">
              <Button variant="primary" className="w-full sm:w-auto h-12 px-8 text-lg">
                Explore Events <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-lg">
                Create Event
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trending Now</h2>
              <p className="text-slate-600 dark:text-slate-400">Join the most anticipated events this month</p>
            </div>
            <Link to="/events" className="hidden sm:flex text-primary-600 font-medium items-center gap-1 hover:text-primary-700 transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="mt-12 text-center sm:hidden">
            <Link to="/events" className="text-primary-600 font-medium inline-flex items-center gap-1">
              View all events <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
