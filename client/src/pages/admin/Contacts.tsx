import { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  course?: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await contactAPI.getAll();
      // Handle both direct array response and response.data structure
      const data = response.data || response;
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openContactModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    setStatusError('');
  };

  const handleStatusChange = async (contactId: string, newStatus: 'new' | 'read' | 'responded') => {
    setIsSavingStatus(true);
    setStatusError('');
    try {
      await contactAPI.updateStatus(contactId, newStatus);
      
      // Update state locally to avoid refetching
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact._id === contactId ? { ...contact, status: newStatus } : contact
        )
      );
      
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
      setStatusError('Failed to update status. Please try again.');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactAPI.delete(id);
      closeModal();
      fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact. Please try again.');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Contacts</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'new' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'read' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'responded' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Responded
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchContacts}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      {contact.course && (
                        <div className="text-xs text-gray-500">Course: {contact.course}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status)}`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openContactModal(contact)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Detail Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Contact Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-800 font-medium">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium">{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedContact.createdAt).toLocaleDateString()}{' '}
                  {new Date(selectedContact.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {selectedContact.course && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Course Inquiry</p>
                  <p className="text-gray-800 font-medium">{selectedContact.course}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Message</p>
                <p className="text-gray-800 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'new')}
                      disabled={isSavingStatus}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedContact.status === 'new' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'read')}
                      disabled={isSavingStatus}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedContact.status === 'read' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'responded')}
                      disabled={isSavingStatus}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedContact.status === 'responded' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Responded
                    </button>
                  </div>
                  {statusError && <p className="text-red-500 text-sm mt-1">{statusError}</p>}
                </div>
                <button
                  onClick={() => handleDeleteContact(selectedContact._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 