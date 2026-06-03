import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, ImageIcon, FileText, Users, Tag, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { createEvent, getUserProfile, updateUserProfile } from '../api';
import { AuthContext } from '../context/AuthContext';

const CreateEvent = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    location: '',
    date: '',
    price: 0,
    image: '',
    description: '',
    totalSeats: 100,
    availableSeats: 100,
    featured: false
  });

  useEffect(() => {
    const verifyPermission = async () => {
      try {
        const { data } = await getUserProfile();
        updateUser(data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyPermission();
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const { data } = await updateUserProfile({ eventCreationRequest: 'pending' });
      updateUser(data);
      toast.success('Your event creation permission request has been submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request. Please try again.');
      console.error(error);
    } finally {
      setIsRequesting(false);
    }
  };

  const applyPresetImage = (categoryName) => {
    const presets = {
      Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      Music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      Business: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
      'Arts & Culture': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80',
      'Food & Drink': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80'
    };
    if (presets[categoryName]) {
      setFormData(prev => ({ ...prev, image: presets[categoryName] }));
      toast.success('Category preset image applied!');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!formData.title || !formData.location || !formData.date || !formData.description) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.totalSeats), // Initially available = total
      };

      const { data } = await createEvent(eventData);
      toast.success('Event created successfully!');
      navigate(`/events/${data._id || data.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasApproved = user && (user.isAdmin || user.eventCreationRequest === 'approved');

  if (!hasApproved) {
    const status = user?.eventCreationRequest || 'none';
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Onboarding Steps */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 h-full flex flex-col justify-between border border-slate-200/50 dark:border-slate-800/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Creator Onboarding</h3>
                <div className="space-y-8 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {/* Step 1 */}
                  <div className="flex gap-4 relative items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm z-10 shadow-md shadow-emerald-500/20">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-none mt-1">Register Account</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Setup user profile</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 relative items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs z-10 shadow-md transition-colors ${
                      status === 'approved'
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : status === 'pending'
                          ? 'bg-amber-500 text-white shadow-amber-500/20 animate-pulse'
                          : status === 'rejected'
                            ? 'bg-rose-500 text-white shadow-rose-500/20'
                            : 'bg-primary-600 text-white shadow-primary-500/20'
                    }`}>
                      {status === 'approved' ? '✓' : status === 'pending' ? '⏳' : status === 'rejected' ? '✗' : '2'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-none mt-1">Request Authorization</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {status === 'pending' ? 'Awaiting review' : status === 'rejected' ? 'Declined' : 'Submit request'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 relative items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-semibold text-sm z-10">
                      🔒
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-400 dark:text-slate-500 leading-none mt-1">Publish Events</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-605 mt-1">Unlock ticketing panel</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">Need help? Contact support@eventmaster.com</p>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Status Detail Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <GlassCard className="p-8 border border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col justify-between">
                {status === 'none' && (
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Host and Sell Tickets on EventMaster</h2>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Expand your reach! Once authorized, you can organize custom workshops, music festivals, tech talks, and category-focused events. Manage seat inventories, track transactions, and generate automated PDF/QR-coded tickets for attendees.
                      </p>
                    </div>

                    <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Creator benefits</h4>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                        <li>AI recommendation placement for matching user interest vectors.</li>
                        <li>Dynamic tickets with validation QR codes.</li>
                        <li>Custom analytics dashboard to monitor bookings and revenue.</li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="primary" onClick={handleRequestPermission} disabled={isRequesting}>
                        {isRequesting ? 'Submitting...' : 'Request Creator Access'}
                      </Button>
                      <Button variant="secondary" onClick={() => navigate('/')}>
                        Back to Home
                      </Button>
                    </div>
                  </div>
                )}

                {status === 'pending' && (
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                      <Clock size={28} className="animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Under Review</h2>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Our administration team is currently reviewing your event creator application. Reviews typically take less than 24 hours. In the meantime, you can draft event descriptions or pick high-quality graphics to launch your page instantly once authorized.
                      </p>
                    </div>

                    <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Preparation Tip</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Gather your cover images, map coordinates, pricing details, and total attendee limits so you can publish your event immediately.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" onClick={() => navigate('/')}>
                        Go to Home
                      </Button>
                    </div>
                  </div>
                )}

                {status === 'rejected' && (
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
                      <AlertTriangle size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Declined</h2>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        Unfortunately, your request to become an event organizer was declined by the administration. Make sure your profile has complete details before submitting another request.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="primary" onClick={handleRequestPermission} disabled={isRequesting}>
                        {isRequesting ? 'Submitting...' : 'Re-submit Request'}
                      </Button>
                      <Button variant="secondary" onClick={() => navigate('/')}>
                        Back to Home
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create New Event</h1>
          <p className="text-slate-600 dark:text-slate-400">Fill in the details below to host your event on EventMaster.</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Innovators Conference 2026"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-slate-400" />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Business">Business</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Food & Drink">Food & Drink</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date & Time *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Online or physical address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Capacity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="totalSeats"
                    min="1"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL *</label>
                  <button 
                    type="button"
                    onClick={() => applyPresetImage(formData.category)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline font-semibold"
                  >
                    Apply category preset
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="url"
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description *</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText size={18} className="text-slate-400" />
                  </div>
                  <textarea
                    name="description"
                    required
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us more about the event..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Feature this event on the home page
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
