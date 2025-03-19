import { useState, useEffect } from 'react';
import { videoAPI } from '../../services/api';
import { FaPlay, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface VideoFormData {
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  featured: boolean;
  isActive: boolean;
}

const initialFormData: VideoFormData = {
  title: '',
  description: '',
  youtubeId: '',
  category: '',
  featured: false,
  isActive: true
};

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<VideoFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getAll({ sort: '-createdAt' });
      
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
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update preview when YouTube ID changes
    if (name === 'youtubeId') {
      setPreviewUrl(`https://www.youtube.com/embed/${value}`);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setPreviewUrl('');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await videoAPI.update(editingId, formData);
        toast.success('Video updated successfully');
      } else {
        await videoAPI.create(formData);
        toast.success('Video added successfully');
      }
      
      closeModal();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
      category: video.category,
      featured: video.featured,
      isActive: video.isActive
    });
    setEditingId(video._id);
    setPreviewUrl(`https://www.youtube.com/embed/${video.youtubeId}`);
    openModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoAPI.delete(id);
        toast.success('Video deleted successfully');
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      }
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await videoAPI.update(id, { featured: !featured });
      toast.success(featured ? 'Removed from featured videos' : 'Added to featured videos');
      fetchVideos();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await videoAPI.update(id, { isActive: !isActive });
      toast.success(isActive ? 'Video hidden' : 'Video activated');
      fetchVideos();
    } catch (error) {
      console.error('Error updating active status:', error);
      toast.error('Failed to update active status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const extractYoutubeIdFromUrl = (url: string) => {
    // Extract YouTube ID from various URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url;
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const youtubeId = extractYoutubeIdFromUrl(url);
    
    setFormData({
      ...formData,
      youtubeId
    });
    
    setPreviewUrl(`https://www.youtube.com/embed/${youtubeId}`);
  };

  return (
    <div className="p-6">
      <ToastContainer position="bottom-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Videos</h1>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Video
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-40 h-24 relative rounded overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        frameBorder="0" 
                        className="absolute top-0 left-0"
                      ></iframe>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{video.description}</div>
                    <div className="mt-1">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {video.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => toggleFeatured(video._id, video.featured)}
                        className={`inline-flex items-center text-sm ${video.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                      >
                        {video.featured ? <FaStar className="mr-1" /> : <FaRegStar className="mr-1" />}
                        {video.featured ? 'Featured' : 'Not Featured'}
                      </button>
                      
                      <button 
                        onClick={() => toggleActive(video._id, video.isActive)}
                        className={`inline-flex items-center text-sm ${video.isActive ? 'text-green-500' : 'text-red-500'}`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full mr-1 ${video.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {video.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(video.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {videos.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No videos found. Add your first video!</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube URL *
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=xxxxx"
                      value={formData.youtubeId.includes('http') ? formData.youtubeId : `https://www.youtube.com/watch?v=${formData.youtubeId}`}
                      onChange={handleYoutubeUrlChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Paste full YouTube URL or just the video ID
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                        Featured Video
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
                    {previewUrl ? (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={previewUrl}
                        title="YouTube video preview"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-4">
                          <FaPlay className="mx-auto text-4xl text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">Enter YouTube URL to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos; 