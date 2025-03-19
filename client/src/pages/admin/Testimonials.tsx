import { useState, useEffect } from 'react';
import { testimonialAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar, FaCheck } from 'react-icons/fa';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  isActive: boolean;
  isApproved: boolean;
}

interface FormData {
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  isActive: boolean;
  isApproved: boolean;
}

const initialFormData: FormData = {
  name: '',
  role: 'Student',
  content: '',
  rating: 5,
  image: '',
  isActive: true,
  isApproved: true
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    if (activeTab === 'all') {
      fetchTestimonials(currentPage);
    } else {
      fetchPendingTestimonials();
    }
  }, [currentPage, activeTab]);

  const fetchTestimonials = async (page: number) => {
    try {
      setLoading(true);
      const response = await testimonialAPI.getAll({
        page,
        limit: 10,
        sort: '-createdAt'
      });
      
      console.log('Testimonials response:', response);
      
      // Extract testimonials data
      let testimonialData = [];
      let pagination = { next: null, prev: null };
      
      if (response && response.data && Array.isArray(response.data)) {
        testimonialData = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        testimonialData = response.data.data;
        pagination = response.data.pagination || pagination;
      }
      
      setTestimonials(testimonialData);
      
      // Calculate total pages
      if (response && response.data && response.data.pagination) {
        const total = response.data.pagination.total || testimonialData.length;
        const limit = response.data.pagination.limit || 10;
        setTotalPages(Math.ceil(total / limit));
      } else {
        setTotalPages(Math.ceil(testimonialData.length / 10));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialAPI.getPending();
      
      console.log('Pending testimonials response:', response);
      
      // Extract testimonials data
      let testimonialData = [];
      
      if (response && response.data && Array.isArray(response.data)) {
        testimonialData = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        testimonialData = response.data.data;
      }
      
      setPendingTestimonials(testimonialData);
    } catch (error) {
      console.error('Error fetching pending testimonials:', error);
      setPendingTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'rating') {
      // Ensure rating is a number between 1 and 5
      const ratingValue = Math.min(5, Math.max(1, parseInt(value, 10) || 1));
      setFormData(prev => ({ ...prev, [name]: ratingValue }));
    } else if (name === 'name') {
      // Update image with DiceBear API when name changes
      const initial = value.charAt(0);
      const imageUrl = initial ? `https://api.dicebear.com/9.x/initials/svg?seed=${initial}` : '/images/testimonials/default-avatar.png';
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        image: imageUrl
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage('');
    
    try {
      if (isEditing && formData._id) {
        const response = await testimonialAPI.update(formData._id, formData);
        console.log('Update response:', response);
      } else {
        const response = await testimonialAPI.create(formData);
        console.log('Create response:', response);
      }
      
      setSubmitStatus('success');
      resetForm();
      fetchTestimonials(currentPage);
      if (pendingTestimonials.length > 0) {
        fetchPendingTestimonials();
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      setSubmitStatus('error');
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(
          Array.isArray(error.response.data.error) 
            ? error.response.data.error.join(', ') 
            : error.response.data.error
        );
      } else {
        setErrorMessage('Failed to save testimonial. Please try again.');
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      _id: testimonial._id,
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
      isActive: testimonial.isActive,
      isApproved: testimonial.isApproved
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      await testimonialAPI.delete(id);
      if (activeTab === 'all') {
        fetchTestimonials(currentPage);
      } else {
        fetchPendingTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await testimonialAPI.approve(id);
      fetchPendingTestimonials();
      if (activeTab === 'all') {
        fetchTestimonials(currentPage);
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Failed to approve testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      image: ''
    });
    setIsEditing(false);
    setShowForm(false);
  };

  // Render star ratings input
  const renderStarInput = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <FaStar />
          </button>
        ))}
        <span className="ml-2 text-gray-600">({formData.rating} out of 5)</span>
      </div>
    );
  };

  // Render star ratings display
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

  if (loading && testimonials.length === 0 && pendingTestimonials.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Testimonials</h1>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Testimonial
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          
          {submitStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
              Testimonial saved successfully!
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                {renderStarInput()}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isApproved"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-700">
                  Approved
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaSave className="mr-2" />
                {isEditing ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Testimonials
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => {
                setActiveTab('pending');
                fetchPendingTestimonials();
              }}
              className={`inline-block py-2 px-4 text-sm font-medium ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval
              {pendingTestimonials.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                  {pendingTestimonials.length}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'pending' ? (
        pendingTestimonials.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTestimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{renderStars(testimonial.rating)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{testimonial.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(testimonial._id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No pending testimonials awaiting approval.</p>
          </div>
        )
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{renderStars(testimonial.rating)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{testimonial.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          testimonial.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testimonial.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!testimonial.isApproved && (
                        <button
                          onClick={() => handleApprove(testimonial._id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTestimonials; 