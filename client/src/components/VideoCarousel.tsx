import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { videoAPI } from '../services/api';

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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoAPI.getAll({
          limit,
          // Only fetch active videos
          filters: {
            isActive: true,
            featured: true
          }
        });
        
        // Extract videos data
        let videoData = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          videoData = response.data;
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          videoData = response.data.data;
        }
        
        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        {videos.map((video) => (
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