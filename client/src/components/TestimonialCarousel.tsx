import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { testimonialAPI } from '../services/api';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

interface TestimonialCarouselProps {
  limit?: number;
}

const TestimonialCarousel = ({ limit = 5 }: TestimonialCarouselProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await testimonialAPI.getAll({
          limit,
          sort: '-rating',
          // Only fetch active and approved testimonials
          filters: {
            isActive: true,
            isApproved: true
          }
        });
        
        // Extract testimonials data
        let testimonialData = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          testimonialData = response.data;
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          testimonialData = response.data.data;
        }
        
        setTestimonials(testimonialData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [limit]);

  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar 
            key={index}
            className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="testimonial-carousel my-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">Share your experience with our coaching</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-carousel my-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="py-10"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial._id}>
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col my-7">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.image || `https://api.dicebear.com/9.x/initials/svg?seed=${testimonial.name.charAt(0)}`}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <div className="flex-grow">
                <FaQuoteLeft className="text-blue-200 text-2xl mb-2" />
                <p className="text-gray-700 italic h-24 overflow-y-auto">
                  {testimonial.content}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialCarousel; 