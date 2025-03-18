import { useState } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import TestimonialForm from '../components/TestimonialForm';
import TestimonialCarousel from '../components/TestimonialCarousel';

const Testimonials = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">What Our Students Say</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover what our students and parents have to say about their experience with our coaching programs. 
          Here's what makes us different through their eyes.
        </p>
      </div>
      
      {/* Featured testimonials carousel */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Testimonials</h2>
        <TestimonialCarousel limit={6} />
      </section>
      
      <div className="my-12 text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Share Your Experience'}
        </button>
      </div>
      
      {showForm && (
        <section className="my-12">
          <TestimonialForm />
        </section>
      )}
      
      <section className="my-12 bg-blue-50 py-12 px-6 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Why Our Students Love Us</h2>
          <p className="text-gray-600 mt-2">The top reasons our students and parents keep coming back</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Teachers</h3>
            <p className="text-gray-600">
              Our instructors are subject matter experts with years of teaching experience, providing personalized guidance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Customized Learning</h3>
            <p className="text-gray-600">
              We adapt our teaching methods to match each student's learning style and pace for optimal results.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-500 text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Proven Results</h3>
            <p className="text-gray-600">
              Our students consistently achieve top scores and gain admission to prestigious institutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials; 