import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaPlus as FaPlusCircle } from 'react-icons/fa';

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
  isActive: boolean;
  order: number;
}

interface FormData {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  qualifications: string[];
  areasOfInterest: string[];
  type: string;
  isActive: boolean;
  order: number;
}

const initialFormData: FormData = {
  name: '',
  role: '',
  bio: '',
  image: '',
  email: '',
  qualifications: [''],
  areasOfInterest: [''],
  type: 'team',
  isActive: true,
  order: 0
};

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newAreaOfInterest, setNewAreaOfInterest] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAllAdmin();
      console.log('Team members response:', response);
      
      // Extract team members from the correct path in the response
      if (response && response.data && Array.isArray(response.data)) {
        setTeamMembers(response.data);
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        setTeamMembers(response.data.data);
      } else {
        console.error('Unexpected response format:', response);
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage('');
    
    // Filter out empty qualifications and areas of interest
    const filteredData = {
      ...formData,
      qualifications: formData.qualifications.filter(q => q.trim() !== ''),
      areasOfInterest: formData.areasOfInterest.filter(a => a.trim() !== '')
    };
    
    // Log the data being sent to the server for debugging
    console.log('Submitting team member data:', filteredData);
    
    try {
      if (isEditing && filteredData._id) {
        const response = await teamAPI.update(filteredData._id, filteredData);
        console.log('Update response:', response);
      } else {
        const response = await teamAPI.create(filteredData);
        console.log('Create response:', response);
      }
      
      setSubmitStatus('success');
      resetForm();
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      setSubmitStatus('error');
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(
          Array.isArray(error.response.data.error) 
            ? error.response.data.error.join(', ') 
            : error.response.data.error
        );
      } else {
        setErrorMessage('Failed to save team member. Please try again.');
      }
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      _id: member._id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      email: member.email || '',
      qualifications: member.qualifications || [''],
      areasOfInterest: member.areasOfInterest || [''],
      type: member.type,
      isActive: member.isActive,
      order: member.order
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    
    try {
      await teamAPI.delete(id);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setShowForm(false);
  };

  // Add a new empty qualification input
  const addQualification = () => {
    if (newQualification.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  // Add a new empty area of interest input
  const addAreaOfInterest = () => {
    if (newAreaOfInterest.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, newAreaOfInterest.trim()]
      }));
      setNewAreaOfInterest('');
    }
  };

  // Remove a qualification at the given index
  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  // Remove an area of interest at the given index
  const removeAreaOfInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter((_, i) => i !== index)
    }));
  };

  if (loading && teamMembers.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-800">Manage Team</h1>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Member
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
            {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          
          {submitStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
              Team member saved successfully!
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
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="team">Team Member</option>
                  {/* <option value="developer">Developer</option> */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
            </div>
            
            {/* Qualifications Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications <span className="text-red-500">*</span>
              </label>
              
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex mb-2">
                  <div className="flex-grow">
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <span>{qualification}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  placeholder="Add a qualification"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addQualification}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  <FaPlusCircle />
                </button>
              </div>
            </div>
            
            {/* Areas of Interest Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Interest <span className="text-red-500">*</span>
              </label>
              
              {formData.areasOfInterest.map((area, index) => (
                <div key={index} className="flex mb-2">
                  <div className="flex-grow">
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <span>{area}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeAreaOfInterest(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newAreaOfInterest}
                  onChange={(e) => setNewAreaOfInterest(e.target.value)}
                  placeholder="Add an area of interest"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addAreaOfInterest}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  <FaPlusCircle />
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
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
                {isEditing ? 'Update Member' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {teamMembers.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{member.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.type === 'team' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {member.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeam; 