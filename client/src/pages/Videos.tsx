import { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import { FaYoutube, FaFilter } from 'react-icons/fa';

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  createdAt: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const filters: Record<string, any> = { isActive: true };
        
        if (selectedCategory) {
          filters.category = selectedCategory;
        }
        
        const response = await videoAPI.getAll({
          sort: '-createdAt',
          filters
        });
        
        // Extract videos data
        let videoData = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          videoData = response.data;
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          videoData = response.data.data;
        }
        
        setVideos(videoData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(videoData.map((video: Video) => video.category))
        ).filter(Boolean);
        
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Videos</h1>
          <p className="text-gray-600">Watch our collection of educational videos</p>
        </div>
        
        {categories.length > 0 && (
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <FaFilter className="mr-2 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="aspect-video relative">
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
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{video.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  {video.category && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      {video.category}
                    </span>
                  )}
                  
                  <span className="text-sm text-gray-500">
                    {video.createdAt && formatDate(video.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <FaYoutube className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-500">
            {selectedCategory 
              ? `There are no videos in the "${selectedCategory}" category.` 
              : "There are no videos available at the moment."}
          </p>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show all videos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Videos; 