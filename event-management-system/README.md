# Event Management System - MERN Stack

A complete, modern event management system built with MongoDB, Express.js, React, and Node.js. Features include event creation, user authentication, booking system, admin dashboard, and responsive design.

## Features

### 🎯 Core Features
- **User Authentication** - JWT-based auth with role management (Admin, Organizer, Attendee)
- **Event Management** - Create, edit, delete events with rich details
- **Event Discovery** - Search, filter, and browse events by category, date, location
- **Booking System** - Register for events with confirmation emails
- **Admin Dashboard** - Manage users, events, and view analytics
- **Responsive Design** - Mobile-first design with dark mode support

### 💼 Advanced Features
- **Multiple Event Types** - Physical, Virtual, and Hybrid events
- **Payment Integration** - Ready for Stripe/PayPal integration
- **Email Notifications** - Automated emails for bookings and reminders
- **Analytics Dashboard** - Event performance metrics and charts
- **Calendar Integration** - Full calendar view of events
- **Image Upload** - Cloudinary integration for event images

## Tech Stack

**Frontend:**
- React 18 with Hooks
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Chart.js for analytics
- React Hot Toast for notifications

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Nodemailer for emails
- Express validation

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
git clone <repository-url>
cd event-management-system

2. **Setup Backend**
cd backend
npm install

3. **Setup Frontend**
cd ../frontend
npm install


4. **Environment Variables**

Create `backend/.env` file:

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventmanagement
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api


5. **Start the application**

Backend:
cd backend
npm run dev


Frontend (in new terminal):
cd frontend
npm run dev

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Default Admin Account

Email: `admin@eventmanagement.com`
Password: `admin123`

## Docker Setup

1. **Build and run with Docker Compose**
docker-compose up --build

text

This will start:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 3000

## Project Structure

event-management-system/
├── backend/ # Node.js API server
│ ├── config/ # Database & service configs
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Custom middleware
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ └── utils/ # Utility functions
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components
│ │ ├── context/ # React context
│ │ ├── services/ # API services
│ │ └── utils/ # Helper functions
│ └── public/ # Static assets
└── docker-compose.yml # Docker configuration

text

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Organizer+)
- `PUT /api/events/:id` - Update event (Owner/Admin)
- `DELETE /api/events/:id` - Delete event (Owner/Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the