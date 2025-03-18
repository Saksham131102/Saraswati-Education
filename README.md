# Coaching Platform

A comprehensive MERN stack coaching management platform that enables educational institutions to manage courses, announcements, and contact inquiries.

## Features

- Course management with detailed information
- Announcement system with categories
- Contact form for inquiries
- Admin dashboard for management
- Responsive design using Tailwind CSS

## Technology Stack

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/coaching-platform
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. Seed the database with initial data:
   ```
   npm run seed
   ```
   This will create:
   - An admin account (email: admin@example.com, password: admin123)
   - Sample courses
   - Sample announcements

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_ADMIN_EMAIL=admin@example.com
   VITE_ADMIN_PASSWORD=admin123
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Admin Access

The default admin credentials (set in the `.env` file):
- Email: admin@example.com
- Password: admin123

You can access the admin panel at `/admin/login`.

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course (Admin only)
- `PUT /api/courses/:id` - Update a course (Admin only)
- `DELETE /api/courses/:id` - Delete a course (Admin only)

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create a new announcement (Admin only)
- `PUT /api/announcements/:id` - Update an announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete an announcement (Admin only)

### Contacts
- `GET /api/contacts` - Get all contact messages (Admin only)
- `GET /api/contacts/:id` - Get contact message by ID (Admin only)
- `POST /api/contacts` - Submit a contact form (Public)
- `PUT /api/contacts/:id` - Update contact status (Admin only)
- `DELETE /api/contacts/:id` - Delete a contact message (Admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin (Admin only)
- `PUT /api/auth/change-password` - Change admin password (Admin only)

## Deployment

### Backend
The backend is configured to serve static files from the frontend build in production mode. To deploy:

1. Build the frontend:
   ```
   cd client
   npm run build
   ```

2. Set up environment variables on your production server.

3. Start the server in production mode:
   ```
   cd server
   npm start
   ```

## License

[MIT](LICENSE) 