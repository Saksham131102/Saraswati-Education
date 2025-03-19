import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaBook, FaArrowRight } from 'react-icons/fa';
import { courseAPI, announcementAPI } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestimonialCarousel from '../components/TestimonialCarousel';
import VideoCarousel from '../components/VideoCarousel';

const motivationalQuotes = [
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  }
];

// Background hero image URL
const heroImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';

const Home = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  // const [testimonials, setTestimonials] = useState<any[]>([]);
  // const [newsletterEmail, setNewsletterEmail] = useState('');
  // const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch courses
        const coursesResponse = await courseAPI.getAll();
        setCourses(coursesResponse.data || []);
        
        // Fetch announcements
        const announcementsResponse = await announcementAPI.getAll();
        setAnnouncements(announcementsResponse.data || []);
        
        // Fetch testimonials - sort by rating and limit to top 10
        // const testimonialsResponse = await testimonialAPI.getAll({ 
        //   sort: '-rating', 
        //   limit: 10 
        // });
        // console.log('Testimonials response:', testimonialsResponse);
        
        // // Extract testimonials data
        // let testimonialData = [];
        // if (testimonialsResponse && testimonialsResponse.data && Array.isArray(testimonialsResponse.data)) {
        //   testimonialData = testimonialsResponse.data;
        // } else if (testimonialsResponse && testimonialsResponse.data && testimonialsResponse.data.data && Array.isArray(testimonialsResponse.data.data)) {
        //   testimonialData = testimonialsResponse.data.data;
        // }
        
        // setTestimonials(testimonialData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // const handleNewsletterSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setNewsletterMessage('');

  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email: newsletterEmail }),
  //     });
      
  //     const data = await response.json();
      
  //     if (data.success) {
  //       toast.success('Successfully subscribed to the newsletter!');
  //       setNewsletterEmail('');
  //     } else {
  //       toast.error(data.error || 'Failed to subscribe. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Newsletter subscription error:', error);
  //     toast.error('Failed to subscribe. Please try again later.');
  //   }
  // };

  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" />
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
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

      {/* Motivational Quote Section */}
      <div className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-serif italic mb-4">
            "{motivationalQuotes[1].text}"
          </blockquote>
          <p className="text-lg">- {motivationalQuotes[1].author}</p>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Link 
              to="/courses" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Courses <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.slice(0, 3).map((course) => (
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
      <div className="py-16 bg-gradient-to-r from-blue-900 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl text-white font-bold">Latest Announcements</h2>
            <Link 
              to="/announcements" 
              className="flex items-center text-white hover:text-gray-200 font-medium"
            >
              View All Announcements <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md">
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
      <div className="py-16 bg-gray-50">
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

      {/* Newsletter Section */}
      {/* <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">Subscribe to our newsletter for the latest updates and educational content</p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
};

export default Home; 