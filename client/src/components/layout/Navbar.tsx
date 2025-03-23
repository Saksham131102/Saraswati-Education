import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={'/logo.png'} alt="logo" width={35} height={35} />
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">Sarswati Education</h1>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 text-blue-100 hover:text-white transition-colors ${
                isActive('/') ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`px-3 py-2 text-blue-100 hover:text-white transition-colors ${
                isActive('/courses') ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              Courses
            </Link>
            <Link 
              to="/announcements" 
              className={`px-3 py-2 text-blue-100 hover:text-white transition-colors ${
                isActive('/announcements') ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              Announcements
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 text-blue-100 hover:text-white transition-colors ${
                isActive('/about') ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/developers" 
              className={`px-3 py-2 text-blue-100 hover:text-white transition-colors ${
                isActive('/developers') ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              Developers
            </Link>
            <Link 
              to="/contact" 
              className="px-3 py-2 bg-white text-blue-900 rounded-md hover:bg-blue-50 transition-colors font-semibold"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors ${
                isActive('/') ? 'text-white border-l-4 border-white' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors ${
                isActive('/courses') ? 'text-white border-l-4 border-white' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              to="/announcements" 
              className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors ${
                isActive('/announcements') ? 'text-white border-l-4 border-white' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Announcements
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors ${
                isActive('/about') ? 'text-white border-l-4 border-white' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/developers" 
              className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors ${
                isActive('/developers') ? 'text-white border-l-4 border-white' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Developers
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
