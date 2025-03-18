import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';

interface Course {
  _id: string;
  title: string;
  class: number;
  subject: string;
  description: string;
  duration: string;
  schedule: string;
  image: string;
}

const Courses = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getAll();
        
        // Handle server response format which may include { success, data, count }
        const data = response.data || response;
        setCourses(Array.isArray(data) ? data : (data.data || []));
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const subjects = courses.length > 0 
    ? ['All', ...Array.from(new Set(courses.map(course => course.subject)))]
    : ['All'];

  const filteredCourses = selectedSubject && selectedSubject !== 'All'
    ? courses.filter(course => course.subject === selectedSubject)
    : courses;

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-8">
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Courses</h1>
          <p className="text-xl text-gray-600">
            Explore our wide range of courses designed to help students excel
          </p>
        </div>

        {/* Filter by Subject */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject === 'All' ? null : subject)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                (subject === 'All' && !selectedSubject) || selectedSubject === subject
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Class {course.class}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{course.schedule}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a 
                      href={`/contact?course=${encodeURIComponent(course.title)}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses available at the moment.</p>
          </div>
        )}

        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 