import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaBook, FaArrowRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestimonialCarousel from '../components/TestimonialCarousel';
import VideoCarousel from '../components/VideoCarousel';
import MotivationalQuoteCarousel from '../components/MotivationalQuoteCarousel';
import { ImagesSlider } from '../components/ui/images-slider';
import { useCourses, useAnnouncements, useTeamMembers } from '../hooks/useQueryHooks';
import { queryClient } from '../lib/react-query';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  qualifications: string[];
  areasOfInterest: string[];
  type: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  class: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

const motivationalQuotes = [
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch"
  },
  {
    text: "Education is not the learning of facts, but the training of the mind to think.",
    author: "Albert Einstein"
  },
  {
    text: "A person who never made a mistake never tried anything new.",
    author: "Albert Einstein"
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
  }
];

// Hero background images
const heroImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://cdn.pixabay.com/photo/2017/12/29/20/45/read-3048651_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/11/13/09/58/adult-education-3812693_1280.jpg',
  // 'https://cdn.pixabay.com/photo/2017/09/02/11/04/adult-education-2706977_1280.jpg',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
];

const Home = () => {
  // Pre-fetch and cache critical data
  useEffect(() => {
    const prefetchData = async () => {
      // Prefetch courses if not in cache
      if (!queryClient.getQueryData(['courses-list'])) {
        const { courseAPI } = await import('../services/api');
        queryClient.prefetchQuery({
          queryKey: ['courses-list'],
          queryFn: async () => {
            const response = await courseAPI.getAll();
            if (response?.data && Array.isArray(response.data)) {
              return response.data;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
              return response.data.data;
            }
            return [];
          },
        });
      }

      // Prefetch team members if not in cache
      if (!queryClient.getQueryData(['team-members', 'team'])) {
        const { teamAPI } = await import('../services/api');
        queryClient.prefetchQuery({
          queryKey: ['team-members', 'team'],
          queryFn: async () => {
            const response = await teamAPI.getAll({ type: 'team' });
            if (response?.data && Array.isArray(response.data)) {
              return response.data;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
              return response.data.data;
            }
            return [];
          },
        });
      }
    };

    prefetchData();
  }, []);

  // Use React Query hooks with proper query keys that match the ones used for prefetching
  const { 
    data: courses = [], 
    isLoading: isCoursesLoading,
    error: coursesError
  } = useCourses();
  
  const { 
    data: announcements = [], 
    isLoading: isAnnouncementsLoading,
    error: announcementsError
  } = useAnnouncements();
  
  const { 
    data: teamMembersData = [], 
    isLoading: isTeamLoading,
    error: teamError
  } = useTeamMembers();

  // Filter to just 3 team members
  const teamMembers = teamMembersData.slice(0, 3);
  
  // Combined loading state
  const isLoading = isCoursesLoading || isAnnouncementsLoading || isTeamLoading;
  
  // Handle errors from any of the queries
  useEffect(() => {
    if (coursesError || announcementsError || teamError) {
      toast.error('Failed to load some content. Please try again later.');
    }
  }, [coursesError, announcementsError, teamError]);

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" />
      
      {/* Hero Section with Images Slider */}
      <div className="relative h-[70vh] md:h-[80vh] text-white">
        <ImagesSlider 
          images={heroImages} 
          direction="left" 
          overlayClassName="bg-gradient-to-r from-blue-600/80 to-purple-600/80 opacity-80"
        >
          <div className="relative h-full flex flex-col justify-center items-center">
            <div className="text-center px-4 sm:px-6 lg:px-8 py-24 md:py-32">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transform Your Future with Quality Education
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Join our comprehensive coaching program and achieve your academic goals
              </p>
              <Link
                to="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </ImagesSlider>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <FaGraduationCap className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Teachers</h3>
              <p className="text-gray-600">Learn from experienced educators who are passionate about teaching</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <FaUsers className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Small Batch Size</h3>
              <p className="text-gray-600">Get personalized attention in our small group classes</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <FaBook className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Study Material</h3>
              <p className="text-gray-600">Access well-structured study materials and practice papers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Our Team</h2>
            <Link 
              to="/team" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Team Members <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isTeamLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member: TeamMember) => (
                <div key={member._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-64">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                      <p className="text-blue-200 font-semibold">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Display qualifications */}
                    {member.qualifications && member.qualifications.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
                        <ul className="list-disc pl-5 text-gray-600">
                          {member.qualifications.map((qual: string, index: number) => (
                            <li key={index}>{qual}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Display areas of interest */}
                    {member.areasOfInterest && member.areasOfInterest.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Areas of Interest</h3>
                        <div className="flex flex-wrap gap-2">
                          {member.areasOfInterest.map((area: string, index: number) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-gray-600 leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotivationalQuoteCarousel quotes={motivationalQuotes} />
        </div>
      </div>

      {/* Featured Courses Section */}
      <div id="courses" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Link 
              to="/courses#top" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Courses <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isCoursesLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course: Course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Class {course.class}
                      </span>
                      <Link
                        to={`/courses`}
                        className="text-blue-600 font-semibold hover:text-blue-800"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest Announcements Section */}
      <div id="announcements" className="py-16 bg-gradient-to-r from-blue-900 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl text-white font-bold">Latest Announcements</h2>
            <Link 
              to="/announcements#top" 
              className="flex items-center text-white hover:text-gray-200 font-medium"
            >
              View All Announcements <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isAnnouncementsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.slice(0, 3).map((announcement: Announcement) => (
                <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2
                      ${announcement.category === 'Events' ? 'bg-green-100 text-green-800' :
                        announcement.category === 'Courses' ? 'bg-blue-100 text-blue-800' :
                          announcement.category === 'Holidays' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'}`
                    }>
                      {announcement.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {announcement.content.length > 100 
                        ? `${announcement.content.substring(0, 100)}...` 
                        : announcement.content}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/announcements`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">What Our Students Say</h2>
            <Link 
              to="/testimonials" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Testimonials <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <TestimonialCarousel limit={5} />
        </div>
      </div>

      {/* Videos Section */}
      <div className="pt-16 pb-2 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl text-white font-bold">Educational Videos</h2>
            <Link 
              to="/videos" 
              className="flex items-center text-white hover:text-gray-200 font-medium"
            >
              View All Videos <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <VideoCarousel limit={3} />
        </div>
      </div>
    </div>
  );
};

export default Home; 