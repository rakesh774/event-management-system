import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Share2, Clock, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchEventById, createBooking } from '../api';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data } = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Event not found");
      }
    };
    getEvent();

    // Micro-polling every 15 seconds
    const intervalId = setInterval(getEvent, 15000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    if (!event) return;

    // Countdown timer logic
    const calculateTimeLeft = () => {
      const difference = +new Date(event.date) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        timeLeft = { passed: true };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{error}</h2>
        <Link to="/events">
          <Button variant="primary">Back to Events</Button>
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please log in to register for an event');
      navigate('/login');
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({ eventId: event._id, ticketQuantity: 1 });
      setIsRegistered(true);
      toast.success('Successfully registered! View your ticket in My Bookings.');
      
      // Optioanlly update local seats
      setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsBooking(false);
    }
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const percentageSold = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  return (
    <div className="w-full pb-20">
      {/* Hero Image Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <Link to="/events" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Events
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
            <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-2.5 rounded-xl text-primary-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Date & Time</h4>
                  <p className="text-slate-900 dark:text-white font-medium">{formattedDate}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{formattedTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-2.5 rounded-xl text-primary-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Location</h4>
                  <p className="text-slate-900 dark:text-white font-medium">{event.location}</p>
                  {event.location !== 'Online' && (
                    <a href="#" className="text-primary-600 text-sm hover:underline">View Map</a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-2.5 rounded-xl text-primary-600">
                  <Share2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Share</h4>
                  <div className="flex gap-2 mt-1">
                    <button className="text-slate-400 hover:text-primary-600 transition-colors">Copy Link</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About this Event</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {event.description}
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  Join us for an unforgettable experience. Whether you are an industry veteran or just starting out, 
                  this event is designed to provide immense value. Connect with like-minded individuals, learn from 
                  the experts, and take your skills to the next level.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Registration Panel */}
          <div className="lg:col-span-1">
            <GlassCard className="sticky top-28 p-8 border-t-4 border-t-primary-500">
              {/* Price */}
              <div className="text-center mb-8">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Standard Ticket</p>
                <div className="text-5xl font-bold text-slate-900 dark:text-white">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
              </div>

              {/* Countdown Timer */}
              {!timeLeft.passed && (
                <div className="mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 mb-3">
                    <Clock size={16} /> <span className="text-sm font-medium">Starts in</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{timeLeft.days || '0'}</div>
                      <div className="text-xs text-slate-500">Days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{timeLeft.hours || '0'}</div>
                      <div className="text-xs text-slate-500">Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{timeLeft.minutes || '0'}</div>
                      <div className="text-xs text-slate-500">Mins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{timeLeft.seconds || '0'}</div>
                      <div className="text-xs text-slate-500">Secs</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seats Progress */}
              <div className="mb-8 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-350">Tickets Availability</span>
                  <span className={`font-bold ${event.availableSeats <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                    {event.availableSeats} seats left
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentageSold >= 90 
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse shadow-md shadow-red-500/20' 
                        : percentageSold >= 50 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${percentageSold}%` }}
                  ></div>
                </div>
                {percentageSold >= 90 && event.availableSeats > 0 && (
                  <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1">
                    ⚠️ Selling out fast! Only a few spots left.
                  </p>
                )}
                {event.availableSeats === 0 && (
                  <p className="text-slate-500 text-xs mt-2 font-semibold">
                    This event is fully booked.
                  </p>
                )}
              </div>

              {/* CTA */}
              {isRegistered ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 font-medium">
                  <Check size={20} /> You are registered!
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-full py-4 text-lg"
                  onClick={handleRegister}
                  disabled={event.availableSeats === 0 || timeLeft.passed || isBooking}
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : timeLeft.passed ? 'Event Ended' : event.availableSeats === 0 ? 'Sold Out' : 'Register Now'}
                </Button>
              )}
              
              <p className="text-xs text-slate-500 text-center mt-4">
                Secure checkout provided by Stripe. By registering you agree to our Terms of Service.
              </p>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
