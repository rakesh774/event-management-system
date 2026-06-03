import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import Button from './Button';
import GlassCard from './GlassCard';

const EventCard = ({ event }) => {
  // Format date
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate();
  const dateString = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <GlassCard className="group cursor-pointer p-0 overflow-hidden flex flex-col h-full">
      <div className="h-48 relative overflow-hidden">
        {/* Image with hover effect */}
        <img 
          src={event.image} 
          alt={event.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Date badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg p-2 text-center shadow-md">
          <span className="block text-xs font-bold text-primary-600 uppercase">{month}</span>
          <span className="block text-xl font-bold text-slate-900 dark:text-white">{day}</span>
        </div>
        
        {/* Price tag */}
        <div className="absolute bottom-4 left-4 text-white">
          <span className="bg-primary-600/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-sm">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="text-sm font-medium text-primary-600 mb-2">{event.category}</div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-6 mt-auto">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
            <Calendar size={16} className="text-primary-500 flex-shrink-0" />
            <span className="truncate">{dateString}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
            <MapPin size={16} className="text-primary-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
            <Users size={16} className="text-primary-500 flex-shrink-0" />
            <span className="truncate">{event.availableSeats} seats left</span>
          </div>
        </div>
        
        <Link to={`/events/${event._id || event.id}`} className="mt-auto block">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </div>
    </GlassCard>
  );
};

export default EventCard;
