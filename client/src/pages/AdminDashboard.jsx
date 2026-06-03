import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, DollarSign, Plus, Edit2, Trash2, 
  Tag, MapPin, Clock, FileText, Image as ImageIcon,
  CheckCircle, ArrowLeft, ArrowUpRight, BarChart3, TrendingUp,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, 
  ComposedChart, Line
} from 'recharts';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { 
  fetchAdminStats, fetchEvents, createEvent, 
  updateEvent, deleteEvent, fetchPermissionRequests,
  updatePermissionRequest
} from '../api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0 });
  const [chartsData, setChartsData] = useState({ bookingsData: [], userGrowthData: [], popularEventsData: [] });
  const [events, setEvents] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form / Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null means adding a new event
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    location: '',
    date: '',
    price: 0,
    image: '',
    description: '',
    totalSeats: 100,
    featured: false
  });

  const getDashboardData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await fetchAdminStats();
      setStats(statsRes.data.stats);
      setChartsData(statsRes.data.charts);
      
      const eventsRes = await fetchEvents();
      setEvents(eventsRes.data);

      const requestsRes = await fetchPermissionRequests();
      setPermissionRequests(requestsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionDecision = async (userId, decision) => {
    try {
      await updatePermissionRequest(userId, decision);
      toast.success(`Request ${decision === 'approved' ? 'approved' : 'rejected'} successfully!`);
      setPermissionRequests(prev => prev.filter(req => req._id !== userId));
      
      // Update local stats counts
      const statsRes = await fetchAdminStats();
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error(`Failed to update permission request to ${decision}:`, error);
      toast.error('Failed to process request.');
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Handle opening the form drawer for Add/Edit
  const openDrawer = (eventToEdit = null) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      const dateObj = new Date(eventToEdit.date);
      const formattedDate = dateObj.toISOString().slice(0, 16);
      
      setFormData({
        title: eventToEdit.title || '',
        category: eventToEdit.category || 'Technology',
        location: eventToEdit.location || '',
        date: formattedDate || '',
        price: eventToEdit.price || 0,
        image: eventToEdit.image || '',
        description: eventToEdit.description || '',
        totalSeats: eventToEdit.totalSeats || 100,
        featured: eventToEdit.featured || false
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        category: 'Technology',
        location: '',
        date: '',
        price: 0,
        image: '',
        description: '',
        totalSeats: 100,
        featured: false
      });
    }
    setIsDrawerOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (!formData.title || !formData.location || !formData.date || !formData.description) {
        toast.error('Please fill in all required fields');
        setFormLoading(false);
        return;
      }

      const formattedData = {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        // If adding new, available = total. If editing, we keep the difference or reset it.
        availableSeats: editingEvent 
          ? Math.max(0, Number(formData.totalSeats) - (editingEvent.totalSeats - editingEvent.availableSeats))
          : Number(formData.totalSeats)
      };

      if (editingEvent) {
        await updateEvent(editingEvent._id || editingEvent.id, formattedData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(formattedData);
        toast.success('Event created successfully');
      }

      setIsDrawerOpen(false);
      getDashboardData(); // Refresh data
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
        getDashboardData();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete event');
      }
    }
  };

  // Quick unsplash image suggestion helper
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
      toast.success('Preset image applied!');
    }
  };

  return (
    <div className="w-full pb-20 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen">
      {/* Upper header */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Admin Control Center</h1>
            <p className="text-slate-400">Monitor engagement, analyze statistics, and curate events.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={activeTab === 'overview' ? 'primary' : 'outline'} 
              className={`px-5 py-2.5 rounded-xl border-slate-700 text-white ${activeTab === 'overview' ? 'bg-primary-600 border-transparent' : 'hover:bg-slate-800'}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={18} className="mr-2" /> Overview
            </Button>
            <Button 
              variant={activeTab === 'events' ? 'primary' : 'outline'} 
              className={`px-5 py-2.5 rounded-xl border-slate-700 text-white ${activeTab === 'events' ? 'bg-primary-600 border-transparent' : 'hover:bg-slate-800'}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} className="mr-2" /> Manage Events
            </Button>
            <Button 
              variant={activeTab === 'approvals' ? 'primary' : 'outline'} 
              className={`px-5 py-2.5 rounded-xl border-slate-700 text-white relative ${activeTab === 'approvals' ? 'bg-primary-600 border-transparent' : 'hover:bg-slate-800'}`}
              onClick={() => setActiveTab('approvals')}
            >
              <ShieldCheck size={18} className="mr-2" /> Approvals
              {permissionRequests.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
                  {permissionRequests.length}
                </span>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="px-4 py-2.5 rounded-xl border-slate-700 text-white hover:bg-slate-800"
              onClick={() => openDrawer()}
            >
              <Plus size={18} className="mr-1" /> Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Loading admin operations...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Users */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Users</p>
                      <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
                      <div className="flex items-center text-green-500 text-xs font-semibold gap-0.5">
                        <TrendingUp size={12} /> Active Platform Growth
                      </div>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-950/40 p-4 rounded-2xl text-primary-600">
                      <Users size={28} />
                    </div>
                  </motion.div>

                  {/* Total Bookings */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Bookings</p>
                      <h3 className="text-3xl font-bold">{stats.totalBookings}</h3>
                      <div className="flex items-center text-green-500 text-xs font-semibold gap-0.5">
                        <CheckCircle size={12} /> Confirmed Tickets
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl text-blue-600">
                      <Calendar size={28} />
                    </div>
                  </motion.div>

                  {/* Revenue */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gross Revenue</p>
                      <h3 className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</h3>
                      <div className="flex items-center text-green-500 text-xs font-semibold gap-0.5">
                        <ArrowUpRight size={12} /> Live Ticket Transactions
                      </div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl text-emerald-600">
                      <DollarSign size={28} />
                    </div>
                  </motion.div>
                </div>

                {/* Analytical Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* User Growth Chart */}
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary-500" /> Platform User Growth
                    </h3>
                    <div className="h-[300px] w-full">
                      {chartsData.userGrowthData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartsData.userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                            <XAxis dataKey="date" className="text-xs" stroke="#94a3b8" />
                            <YAxis className="text-xs" stroke="#94a3b8" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                border: 'none', 
                                borderRadius: '12px',
                                color: '#fff' 
                              }} 
                            />
                            <Area type="monotone" dataKey="Total Users" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                            <Area type="monotone" dataKey="New Users" stroke="#06b6d4" strokeWidth={1} fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">No registration history available.</div>
                      )}
                    </div>
                  </GlassCard>

                  {/* Bookings & Revenue */}
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                      <DollarSign size={20} className="text-emerald-500" /> Bookings & Revenue Trend
                    </h3>
                    <div className="h-[300px] w-full">
                      {chartsData.bookingsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartsData.bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                            <XAxis dataKey="date" className="text-xs" stroke="#94a3b8" />
                            <YAxis yAxisId="left" className="text-xs" stroke="#94a3b8" />
                            <YAxis yAxisId="right" orientation="right" className="text-xs" stroke="#94a3b8" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                border: 'none', 
                                borderRadius: '12px',
                                color: '#fff' 
                              }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">No booking transactions recorded.</div>
                      )}
                    </div>
                  </GlassCard>

                  {/* Popular Events Chart */}
                  <GlassCard className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                      <BarChart3 size={20} className="text-blue-500" /> Top Performing Events (by Tickets Sold)
                    </h3>
                    <div className="h-[320px] w-full">
                      {chartsData.popularEventsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={chartsData.popularEventsData} 
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                            <XAxis type="number" className="text-xs" stroke="#94a3b8" />
                            <YAxis dataKey="title" type="category" className="text-xs" stroke="#94a3b8" width={100} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                border: 'none', 
                                borderRadius: '12px',
                                color: '#fff' 
                              }}
                            />
                            <Legend />
                            <Bar dataKey="Tickets Sold" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="Revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">No popular event statistics yet.</div>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Manage Events Tab */}
            {activeTab === 'events' && (
              <GlassCard className="p-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Event Inventories</h3>
                    <p className="text-sm text-slate-500">Add, edit, or remove catalog events.</p>
                  </div>
                  <Button variant="primary" onClick={() => openDrawer()}>
                    <Plus size={16} className="mr-1" /> Add New Event
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold text-sm">
                        <th className="py-4 px-6">Event Details</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Seats Sold</th>
                        <th className="py-4 px-6 text-center">Featured</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {events.map((event) => {
                        const seatsSold = event.totalSeats - event.availableSeats;
                        const dateStr = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        return (
                          <tr key={event._id || event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="py-4 px-6 flex items-center gap-3">
                              <img src={event.image} alt="" loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{event.title}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                  <MapPin size={12} /> {event.location}
                                  <span className="mx-1">•</span>
                                  <Clock size={12} /> {dateStr}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-2.5 py-1 rounded-md">
                                {event.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                              {event.price === 0 ? 'FREE' : `$${event.price}`}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{seatsSold} / {event.totalSeats}</span>
                                <span className="text-slate-400 text-xs">({Math.round((seatsSold/event.totalSeats)*100)}%)</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {event.featured ? (
                                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                  Featured
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">No</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => openDrawer(event)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all"
                                  title="Edit Event"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteEvent(event._id || event.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                  title="Delete Event"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <GlassCard className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Event Creator Approvals</h3>
                  <p className="text-sm text-slate-500">Review pending requests from users asking to host events.</p>
                </div>

                {permissionRequests.length === 0 ? (
                  <div className="text-center py-16 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <ShieldCheck size={36} className="text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No pending requests</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      All event creator authorization requests have been processed.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold text-sm">
                          <th className="py-4 px-6">User Details</th>
                          <th className="py-4 px-6">Email Address</th>
                          <th className="py-4 px-6">Requested On</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {permissionRequests.map((req) => (
                          <tr key={req._id || req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                              {req.name}
                            </td>
                            <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                              {req.email}
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handlePermissionDecision(req._id || req.id, 'approved')}
                                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/10"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handlePermissionDecision(req._id || req.id, 'rejected')}
                                  className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            )}
          </motion.div>
        )}
      </div>

      {/* Slide-over Drawer for Add/Edit Event */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto border-l border-slate-100 dark:border-slate-800"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-bold">{editingEvent ? 'Edit Event Details' : 'Register New Event'}</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure event inventory parameters below.</p>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Symphony Concert"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                    <div className="relative">
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Music">Music</option>
                        <option value="Business">Business</option>
                        <option value="Arts & Culture">Arts & Culture</option>
                        <option value="Food & Drink">Food & Drink</option>
                      </select>
                      <Tag size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date & Time *</label>
                      <div className="relative">
                        <input 
                          type="datetime-local" 
                          name="date" 
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location *</label>
                      <input 
                        type="text" 
                        name="location" 
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Online or Address"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Pricing & Capacity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price ($)</label>
                      <input 
                        type="number" 
                        name="price" 
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Capacity</label>
                      <input 
                        type="number" 
                        name="totalSeats" 
                        min="1"
                        value={formData.totalSeats}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Image URL & Preset Suggestion */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
                      <button 
                        type="button"
                        onClick={() => applyPresetImage(formData.category)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Apply category preset
                      </button>
                    </div>
                    <input 
                      type="url" 
                      name="image" 
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
                    <textarea 
                      name="description" 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Write comprehensive event overview details..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="featured-check"
                      name="featured" 
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                    />
                    <label htmlFor="featured-check" className="text-sm font-medium text-slate-600 dark:text-slate-400 select-none">
                      Feature this event on the landing page
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={formLoading}
                    >
                      {formLoading ? 'Saving...' : editingEvent ? 'Save Changes' : 'Publish Event'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
