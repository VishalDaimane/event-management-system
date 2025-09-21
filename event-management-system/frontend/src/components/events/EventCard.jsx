import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { format, isAfter } from 'date-fns';

const EventCard = ({ event }) => {
  const startDate = new Date(event.dateTime.start);
  const endDate = new Date(event.dateTime.end);
  const isUpcoming = isAfter(startDate, new Date());
  const availableSpots = event.capacity.total - event.capacity.registered;

  const getCategoryColor = (category) => {
    const colors = {
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      seminar: 'bg-purple-100 text-purple-800',
      networking: 'bg-yellow-100 text-yellow-800',
      concert: 'bg-pink-100 text-pink-800',
      sports: 'bg-orange-100 text-orange-800',
      exhibition: 'bg-indigo-100 text-indigo-800',
      webinar: 'bg-cyan-100 text-cyan-800',
      party: 'bg-rose-100 text-rose-800',
      charity: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.images?.[0]?.url || 'https://via.placeholder.com/400x200?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
        {event.pricing.type === 'free' ? (
          <div className="absolute top-3 right-3">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Free
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              <CurrencyDollarIcon className="h-3 w-3 mr-1" />
              {event.pricing.amount}
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CalendarDaysIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {format(startDate, 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>

          {event.type === 'physical' && event.venue ? (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {event.venue.name ? `${event.venue.name}, ` : ''}
                {event.venue.city}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.type === 'virtual' ? 'Virtual Event' : 'Hybrid Event'}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.capacity.registered} / {event.capacity.total} registered
              {availableSpots > 0 && (
                <span className="text-green-600 ml-1">
                  ({availableSpots} spots left)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center mb-4">
          <img
            src={event.organizer?.avatar || 'https://via.placeholder.com/32'}
            alt={event.organizer?.name}
            className="h-8 w-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            by {event.organizer?.name}
          </span>
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {isUpcoming ? 'View Details' : 'Event Ended'}
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
