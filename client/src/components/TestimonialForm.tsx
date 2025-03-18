import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { testimonialAPI } from '../services/api';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Student',
    content: '',
    rating: 5,
    image: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const MAX_WORDS = 30;

  // Update the image URL when name changes
  useEffect(() => {
    if (formData.name) {
      const initial = formData.name.charAt(0);
      const imageUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${initial}`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  }, [formData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'content') {
      const words = value.trim().split(/\s+/);
      const wordCount = words.length;
      setWordCount(wordCount);
      
      // If current words exceed limit and there's content, trim to 30 words
      if (wordCount > MAX_WORDS && value.trim() !== '') {
        const limitedContent = words.slice(0, MAX_WORDS).join(' ');
        setFormData(prev => ({ ...prev, [name]: limitedContent }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // Ensure we have an image URL even if the effect hasn't run yet
      let dataToSubmit = { ...formData };
      if (!dataToSubmit.image && dataToSubmit.name) {
        const initial = dataToSubmit.name.charAt(0);
        dataToSubmit.image = `https://api.dicebear.com/9.x/initials/svg?seed=${initial}`;
      }

      await testimonialAPI.submit(dataToSubmit);
      setSubmitStatus('success');
      setFormData({
        name: '',
        role: 'Student',
        content: '',
        rating: 5,
        image: ''
      });
      setWordCount(0);
    } catch (error: any) {
      console.error('Error submitting testimonial:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error.response?.data?.error || 
        'Failed to submit testimonial. Please try again later.'
      );
    }
  };

  // Render star ratings input
  const renderStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            type="button" 
            onClick={() => handleRatingClick(star)}
            className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Share Your Experience</h2>
      
      {submitStatus === 'success' ? (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Thank You!</h3>
          <p className="text-green-600">
            Your testimonial has been submitted successfully and will be visible after review.
          </p>
          <button 
            onClick={() => setSubmitStatus('idle')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Another Testimonial
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Alumni">Alumni</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Experience <span className="text-red-500">*</span> <span className="text-sm text-gray-500">(Max 30 words)</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={5}
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience with our coaching..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className={`text-sm mt-1 flex justify-end ${wordCount > MAX_WORDS ? 'text-red-500' : 'text-gray-500'}`}>
              {wordCount}/{MAX_WORDS} words
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            {renderStars()}
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitStatus === 'submitting' || wordCount > MAX_WORDS}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestimonialForm; 