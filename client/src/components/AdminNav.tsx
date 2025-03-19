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
  FaYoutube,
  FaBars,
  FaTimes
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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="text-xl font-bold text-blue-600">
                Admin Panel
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-100 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}