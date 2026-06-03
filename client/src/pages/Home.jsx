import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check, Heart, Settings, Users as UsersIcon, ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import EventCard from '../components/ui/EventCard';
import GlassCard from '../components/ui/GlassCard';
import { fetchEvents, fetchEventRecommendations, updateUserProfile, fetchPermissionRequests, updatePermissionRequest } from '../api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSavingInterests, setIsSavingInterests] = useState(false);
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);

  const getPermissionRequests = async () => {
    if (user && user.isAdmin) {
      setIsRequestsLoading(true);
      try {
        const { data } = await fetchPermissionRequests();
        setPermissionRequests(data);
      } catch (error) {
        console.error("Failed to fetch permission requests:", error);
      } finally {
        setIsRequestsLoading(false);
      }
    }
  };

  const handlePermissionDecision = async (userId, decision) => {
    try {
      await updatePermissionRequest(userId, decision);
      toast.success(`Request ${decision === 'approved' ? 'approved' : 'rejected'} successfully!`);
      setPermissionRequests(prev => prev.filter(req => req._id !== userId));
    } catch (error) {
      console.error(`Failed to update permission request to ${decision}:`, error);
      toast.error('Failed to process request.');
    }
  };

  const categories = ['Technology', 'Music', 'Business', 'Arts & Culture', 'Food & Drink'];

  useEffect(() => {
    const getFeaturedEvents = async () => {
      try {
        const { data } = await fetchEvents();
        setFeaturedEvents(data.filter(e => e.featured).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured events:", error);
      }
    };
    getFeaturedEvents();
  }, []);

  const getRecommendations = async () => {
    try {
      const viewed = JSON.parse(localStorage.getItem('viewedCategories') || '[]');
      const { data } = await fetchEventRecommendations(viewed.join(','));
      setRecommendedEvents(data);
    } catch (error) {
      console.error("Failed to fetch recommended events:", error);
    }
  };

  useEffect(() => {
    getRecommendations();
    if (user && user.interests) {
      setSelectedInterests(user.interests);
    }
    if (user && user.isAdmin) {
      getPermissionRequests();
    }
  }, [user]);

  const toggleInterest = (category) => {
    setSelectedInterests(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSaveInterests = async () => {
    setIsSavingInterests(true);
    try {
      const { data } = await updateUserProfile({ interests: selectedInterests });
      updateUser(data);
      toast.success('Your event preferences have been updated!');
      setShowPreferencesPanel(false);
      getRecommendations(); // Refresh
    } catch (error) {
      console.error(error);
      toast.error('Failed to update interests');
    } finally {
      setIsSavingInterests(false);
    }
  };

  const hasInterestsConfigured = user && user.interests && user.interests.length > 0;

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
            <Link to={user && user.isAdmin ? "/admin" : "/create-event"}>
              <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-lg">
                {user && user.isAdmin ? "Admin Panel" : "Create Event"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Admin Creator Request Section */}
      {user && user.isAdmin && permissionRequests.length > 0 && (
        <section className="py-12 bg-amber-500/5 dark:bg-amber-500/10 border-t border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Pending Creator Permissions
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                    {permissionRequests.length}
                  </span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  The following users are requesting authorization to create and host events.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {permissionRequests.map((req) => (
                <GlassCard key={req._id} className="p-5 border border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{req.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{req.email}</p>
                      </div>
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                        <UsersIcon size={16} />
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-1">
                      <Clock size={12} /> Requested on {new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      onClick={() => handlePermissionDecision(req._id, 'approved')}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handlePermissionDecision(req._id, 'rejected')}
                      className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold text-rose-600 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Headline */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5 mb-2">
                <Sparkles size={14} /> AI Tailored Recommendations
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Curated For You</h2>
              <p className="text-slate-600 dark:text-slate-400">Events aligned with your view history and explicit interests.</p>
            </div>
            {user && (
              <button 
                onClick={() => setShowPreferencesPanel(!showPreferencesPanel)}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline"
              >
                <Settings size={16} /> Adjust Preferences
              </button>
            )}
          </div>

          {/* Explicit Interests Setup Panel */}
          {user && (!hasInterestsConfigured || showPreferencesPanel) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-12 overflow-hidden"
            >
              <GlassCard className="p-6 md:p-8 border-t-4 border-t-primary-500 bg-white/70 dark:bg-slate-900/70">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <Heart size={18} className="text-rose-500 fill-rose-500" /> Customize your interests
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Select your favorite categories below, and our algorithm will elevate matching upcoming events.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {categories.map((category) => {
                    const isSelected = selectedInterests.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleInterest(category)}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-primary-600 border-transparent text-white shadow-lg shadow-primary-500/20' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-500'
                        }`}
                      >
                        {isSelected && <Check size={14} />} {category}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveInterests}
                    disabled={isSavingInterests}
                  >
                    {isSavingInterests ? 'Saving...' : 'Save Preferences'}
                  </Button>
                  {hasInterestsConfigured && (
                    <Button variant="outline" onClick={() => setShowPreferencesPanel(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Recommendations Grid */}
          {recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedEvents.slice(0, 3).map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Sparkles size={36} className="text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No custom suggestions yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Explore more events on the platform or configure your interest preferences above to train the algorithm.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Home;
