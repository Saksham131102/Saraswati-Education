import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBook, 
  FaBullhorn, 
  FaEnvelope, 
  FaCog, 
  FaSignOutAlt,
  FaNewspaper,
  FaUsers,
  FaQuoteRight,
  FaYoutube
} from 'react-icons/fa';
import React from 'react';

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const path = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const isActive = (route: string) => {
    return path.startsWith(route) && route !== '/admin';
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/courses', label: 'Courses', icon: FaBook },
    { path: '/admin/announcements', label: 'Announcements', icon: FaBullhorn },
    { path: '/admin/contacts', label: 'Contacts', icon: FaEnvelope },
    { path: '/admin/newsletter', label: 'Newsletter', icon: FaNewspaper },
    { path: '/admin/team', label: 'Team', icon: FaUsers },
    { path: '/admin/testimonials', label: 'Testimonials', icon: FaQuoteRight },
    { path: '/admin/videos', label: 'Videos', icon: FaYoutube },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="text-xl font-bold text-blue-600">
                Admin Panel
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {/* Desktop navigation */}
              <Link
                to="/admin/dashboard"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaTachometerAlt className="mr-1" />
                Dashboard
              </Link>
              <Link
                to="/admin/courses"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/courses')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBook className="mr-1" />
                Courses
              </Link>
              <Link
                to="/admin/announcements"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/announcements')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBullhorn className="mr-1" />
                Announcements
              </Link>
              <Link
                to="/admin/contacts"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/contacts')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaEnvelope className="mr-1" />
                Contacts
              </Link>
              <Link
                to="/admin/newsletter"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/newsletter')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaNewspaper className="mr-1" />
                Newsletter
              </Link>
              <Link
                to="/admin/team"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/team')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUsers className="mr-1" />
                Team
              </Link>
              <Link
                to="/admin/testimonials"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/testimonials')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaQuoteRight className="mr-1" />
                Testimonials
              </Link>
              <Link
                to="/admin/videos"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/videos')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaYoutube className="mr-1" />
                Videos
              </Link>
              <Link
                to="/admin/settings"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/settings')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCog className="mr-1" />
                Settings
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* Mobile navigation */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-2" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-100"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}