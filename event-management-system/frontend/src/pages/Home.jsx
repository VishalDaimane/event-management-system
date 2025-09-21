import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import EventCard from '../components/events/EventCard';
import { eventService } from '../services/eventService';

const Home = () => {
  // Fetch featured events
  const { data: eventsData } = useQuery(
    ['events', { limit: 6, upcoming: true }],
    () => eventService.getEvents({ limit: 6, upcoming: true }),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: categoriesData } = useQuery(
    'categories',
    eventService.getCategories,
    { staleTime: 10 * 60 * 1000 }
  );

  const featuredEvents = eventsData?.events || [];
  const categories = categoriesData?.categories || [];

  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Easy Event Creation',
      description: 'Create and manage events with our intuitive interface'
    },
    {
      icon: MapPinIcon,
      title: 'Location & Virtual',
      description: 'Host physical, virtual, or hybrid events seamlessly'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Building',
      description: 'Connect attendees and build lasting communities'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Track performance with detailed analytics'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Create, manage, and discover events that matter. Join thousands of organizers 
              and attendees building communities through memorable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Explore Events
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/create-event"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Create Event
                <SparklesIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Don't miss out on these amazing upcoming events
            </p>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No featured events available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View all events
              <ArrowRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Event Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find events that match your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.value}
                to={`/events?category=${category.value}`}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {category.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose EventFlow?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to create successful events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Next Event?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of organizers who trust EventFlow to power their events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/create-event"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white border-2 border-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Create Event
              <SparklesIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
