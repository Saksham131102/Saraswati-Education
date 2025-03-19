import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAnnouncements } from '../hooks/useQueryHooks';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

const Announcements = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Use React Query hook with category filter
  const { 
    data: announcements = [], 
    isLoading, 
    error,
    refetch
  } = useAnnouncements(selectedCategory !== 'All' ? selectedCategory : '');

  const categories = ['All', 'Courses', 'Events', 'Holidays', 'General'];

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="top" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Link to="/#announcements" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
          
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-8">
            <p>Failed to load announcements. Please try again later.</p>
          </div>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="top" className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/#announcements" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Announcements</h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest news and announcements
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {announcements.length > 0 ? (
          <div className="space-y-8">
            {announcements.map((announcement: Announcement) => (
              <div key={announcement._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      announcement.category === 'Courses' ? 'bg-green-100 text-green-800' :
                      announcement.category === 'Events' ? 'bg-blue-100 text-blue-800' :
                      announcement.category === 'Holidays' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(announcement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {selectedCategory === 'All' 
                ? 'No announcements available at the moment.' 
                : `No announcements found in the "${selectedCategory}" category.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements; 