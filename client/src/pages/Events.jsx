import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import EventCard from '../components/ui/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';
import { fetchEvents, fetchEventSuggestions } from '../api';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('Anywhere');
  
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, date: null });
    }
    for (let i = 1; i <= numberOfDays; i++) {
      days.push({ day: i, date: new Date(year, month, i) });
    }
    return days;
  };

  const getEventsForDay = (dayDate) => {
    if (!dayDate) return [];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === dayDate.getDate() &&
             eventDate.getMonth() === dayDate.getMonth() &&
             eventDate.getFullYear() === dayDate.getFullYear();
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technology': return 'bg-blue-500';
      case 'Music': return 'bg-purple-500';
      case 'Business': return 'bg-emerald-500';
      case 'Arts & Culture': return 'bg-pink-500';
      case 'Food & Drink': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      try {
        // Track viewed category in local storage
        if (categoryFilter && categoryFilter !== 'All Categories') {
          const viewed = JSON.parse(localStorage.getItem('viewedCategories') || '[]');
          const updated = [categoryFilter, ...viewed.filter(c => c !== categoryFilter)].slice(0, 10);
          localStorage.setItem('viewedCategories', JSON.stringify(updated));
        }

        const { data } = await fetchEvents(
          searchTerm, 
          categoryFilter === 'All Categories' ? '' : categoryFilter, 
          locationFilter === 'Anywhere' ? '' : locationFilter
        );
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      getEvents();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, categoryFilter, locationFilter]);

  // Suggestions Fetch
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const { data } = await fetchEventSuggestions(searchTerm);
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    };

    const debounceId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Events</h1>
          <p className="text-slate-600 dark:text-slate-400">Discover what's happening around you</p>
        </div>
        <div className="flex gap-2 bg-slate-105 dark:bg-slate-850 p-1.5 rounded-xl self-end md:self-auto shadow-inner">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Calendar View
          </button>
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                  
                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                      >
                        {suggestions.map((item) => (
                          <div 
                            key={item._id || item.id}
                            onClick={() => {
                              setSearchTerm(item.title);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                          >
                            <img src={item.image} alt="" loading="lazy" className="w-8 h-8 rounded object-cover bg-slate-100" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                              <p className="text-xs text-slate-500 truncate">{item.category} • {item.location}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

        {/* Events Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {viewMode === 'calendar' ? (
            <GlassCard className="p-6 md:p-8">
              {/* Calendar Month Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="text-primary-600 dark:text-primary-400" size={22} />
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Weekdays Labels */}
              <div className="grid grid-cols-7 gap-2 mb-4 text-center font-bold text-slate-500 text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>

              {/* Month Grid Days */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((dayInfo, idx) => {
                  const dayEvents = getEventsForDay(dayInfo.date);
                  const isSelected = selectedDate && dayInfo.date &&
                    dayInfo.date.getDate() === selectedDate.getDate() &&
                    dayInfo.date.getMonth() === selectedDate.getMonth() &&
                    dayInfo.date.getFullYear() === selectedDate.getFullYear();

                  const isToday = dayInfo.date && 
                    new Date().getDate() === dayInfo.date.getDate() &&
                    new Date().getMonth() === dayInfo.date.getMonth() &&
                    new Date().getFullYear() === dayInfo.date.getFullYear();

                  if (!dayInfo.day) {
                    return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-xl" />;
                  }

                  return (
                    <button
                      key={`day-${dayInfo.day}`}
                      onClick={() => setSelectedDate(isSelected ? null : dayInfo.date)}
                      className={`aspect-square p-2 rounded-xl flex flex-col justify-between items-center border transition-all ${
                        isSelected 
                          ? 'bg-primary-600 border-transparent text-white shadow-lg shadow-primary-500/25 scale-102 font-bold' 
                          : isToday
                            ? 'bg-primary-50 dark:bg-primary-950/25 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-primary-500'
                      }`}
                    >
                      <span className="text-sm">{dayInfo.day}</span>
                      <div className="flex flex-wrap gap-1 justify-center max-w-full">
                        {dayEvents.slice(0, 3).map((ev, eIdx) => (
                          <div
                            key={ev._id || ev.id || eIdx}
                            className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : getCategoryColor(ev.category)}`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className={`text-[8px] font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>+</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          ) : null}

          {/* Dynamic Selection Alert & Events List */}
          <div>
            {selectedDate && (
              <div className="flex justify-between items-center mb-6 bg-primary-50/50 dark:bg-primary-950/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30">
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                  Showing events for {selectedDate.toLocaleDateString(undefined, { dateStyle: 'long' })} ({getEventsForDay(selectedDate).length} events)
                </span>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Show all upcoming events
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (selectedDate ? getEventsForDay(selectedDate) : filteredEvents).length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {(selectedDate ? getEventsForDay(selectedDate) : filteredEvents).map((event) => (
                  <motion.div key={event._id || event.id} variants={itemVariants} className="h-full">
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
                <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or checking other dates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
