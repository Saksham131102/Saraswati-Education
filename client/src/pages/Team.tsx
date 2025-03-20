import { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';

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
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await teamAPI.getAll({ type: 'team' });
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

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600">
            Meet the dedicated professionals who make our coaching center a success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-96">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                  <p className="text-blue-200 font-semibold">{member.role}</p>
                </div>
              </div>
              <div className="p-6">
                {/* Display qualifications */}
                {member.qualifications && member.qualifications.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      {member.qualifications.map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Display areas of interest */}
                {member.areasOfInterest && member.areasOfInterest.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Areas of Interest</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.areasOfInterest.map((area, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                
                {/* Contact info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                      {member.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team; 
