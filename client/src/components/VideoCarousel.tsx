import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useVideos } from '../hooks/useQueryHooks';
import { useEffect } from 'react';
import { queryClient } from '../lib/react-query';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
}

interface VideoCarouselProps {
  limit?: number;
}

const VideoCarousel = ({ limit = 3 }: VideoCarouselProps) => {
  const options = { limit, featured: true };
  
  // Pre-fetch and cache videos data
  useEffect(() => {
    // Prefetch videos if they're not already in the cache
    if (!queryClient.getQueryData(['videos-list', JSON.stringify(options)])) {
      queryClient.prefetchQuery({
        queryKey: ['videos-list', JSON.stringify(options)],
        queryFn: async () => {
          const { videoAPI } = await import('../services/api');
          const response = await videoAPI.getAll({
            limit: options.limit,
            filters: {
              isActive: true,
              featured: true
            }
          });
          
          // Extract data
          if (response?.data && Array.isArray(response.data)) {
            return response.data;
          } else if (response?.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
          return [];
        },
      });
    }
  }, [limit]);

  // Use React Query hook
  const { 
    data: videos = [], 
    isLoading, 
    error 
  } = useVideos(options);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-carousel my-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>Failed to load videos. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="video-carousel my-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">No videos available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-carousel my-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
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
        {videos.map((video: Video) => (
          <SwiperSlide key={video._id}>
            <div className="bg-white rounded-lg shadow-lg p-6 h-100 flex flex-col my-7">
              <div className="aspect-video mb-4 relative rounded-lg overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{video.description}</p>
              
              {video.category && (
                <div className="mt-auto">
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                    {video.category}
                  </span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCarousel; 