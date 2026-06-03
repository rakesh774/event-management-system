import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, Download } from 'lucide-react';
import { fetchMyBookings } from '../api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await fetchMyBookings();
        setBookings(data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };
    getBookings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Tickets</h1>
        <p className="text-slate-600 dark:text-slate-400">View and manage your upcoming event registrations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-slate-400 mb-4 flex justify-center">
            <Ticket size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You haven't registered for any events.</p>
          <Link to="/events">
            <Button variant="primary">Explore Events</Button>
          </Link>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {bookings.map((booking) => (
            <motion.div key={booking._id} variants={itemVariants}>
              <GlassCard className="p-0 overflow-hidden flex flex-col h-full relative">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img 
                    src={booking.event.image} 
                    alt={booking.event.title} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white line-clamp-1">
                    {booking.event.title}
                  </h3>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 gap-2">
                      <Calendar size={16} className="text-primary-500" />
                      <span>{new Date(booking.event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 gap-2">
                      <MapPin size={16} className="text-primary-500" />
                      <span>{booking.event.location}</span>
                    </div>
                  </div>

                  {/* Ticket Details & QR Code */}
                  <div className="mt-auto border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ticket x{booking.ticketQuantity}</p>
                        <p className="font-mono text-sm text-slate-900 dark:text-white mt-1">#{booking._id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="h-16 w-16 bg-white p-1 rounded-lg">
                        {/* Display base64 QR code sent from backend */}
                        <img src={booking.qrCodeImage} alt="QR Code" className="w-full h-full" />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full text-xs">
                      <Download size={14} className="mr-2" /> Download Ticket
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyBookings;
