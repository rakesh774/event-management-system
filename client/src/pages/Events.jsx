import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import EventCard from '../components/ui/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';
import { events } from '../data/events';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('Anywhere');
  
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let results = events;
      
      // Search filter
      if (searchTerm) {
        results = results.filter(e => 
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Category filter
      if (categoryFilter !== 'All Categories') {
        results = results.filter(e => e.category === categoryFilter);
      }
      
      // Location filter
      if (locationFilter !== 'Anywhere') {
        if (locationFilter === 'Online') {
          results = results.filter(e => e.location === 'Online');
        } else {
          // Simplistic exact match for other locations, but online is special
          results = results.filter(e => e.location.includes(locationFilter));
        }
      }
      
      setFilteredEvents(results);
      setIsLoading(false);
    }, 800); // 800ms artificial delay for skeleton loading
    
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, locationFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Events</h1>
          <p className="text-slate-600 dark:text-slate-400">Discover what's happening around you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-28">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Music</option>
                  <option>Business</option>
                  <option>Arts & Culture</option>
                  <option>Food & Drink</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option>Anywhere</option>
                  <option>Online</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>Austin</option>
                  <option>London</option>
                  <option>Chicago</option>
                </select>
              </div>

              <Button variant="outline" className="w-full" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All Categories');
                setLocationFilter('Anywhere');
              }}>
                Clear Filters
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Events Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants} className="h-full">
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400 mb-4 flex justify-center">
                <Search size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
              <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or search term.</p>
              <Button 
                variant="outline" 
                className="mt-6 mx-auto"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All Categories');
                  setLocationFilter('Anywhere');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
