import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await teamAPI.getAll({ type: 'team' });
        console.log('Team members response in About page:', response);
        
        // Extract team members from the correct path in the response
        let teamData = [];
        if (response && response.data && Array.isArray(response.data)) {
          teamData = response.data;
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          teamData = response.data.data;
        }
        
        // Only show first 3 team members
        setTeamMembers(teamData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Empowering students with quality education since 2023
          </p>
        </div>

        {/* Mission Section */}
        {/* <div className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              Our mission is to provide high-quality education that empowers students to achieve their academic goals
              and develop into well-rounded individuals. We believe in creating an environment that fosters learning,
              critical thinking, and personal growth.
            </p>
          </div>
        </div> */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-white text-lg">
              Our mission is to provide high-quality education that helps students achieve their academic goals and grow into well-rounded individuals. We create a supportive environment that fosters learning, critical thinking, and personal growth. By using innovative teaching methods, we equip students with the skills, knowledge, and confidence needed to succeed in their studies and future careers.

            </p>
            <p className="text-white text-lg mt-4">
              Beyond academics, we focus on character, integrity, and leadership. We aim to inspire a lifelong love for learning and instill values that encourage students to make meaningful contributions to society. Through a dedicated faculty, a strong curriculum, and an inclusive community, we empower students to reach their full potential and create a positive impact in the world.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Our Team</h2>
            <Link 
              to="/team" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View All Team Members
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-64">
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
          )}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from teaching to student support.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We foster a supportive community where students can learn and grow together.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace innovative teaching methods to provide the best learning experience.
              </p>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Our History</h2>
          <div className="prose max-w-none">
            <p className="text-white">
              Founded in 2023, our coaching platform has been dedicated to providing quality education. Over time, we have helped many students reach their academic goals and prepare for their future careers.
            </p>
            <p className="text-white mt-4">
              As education evolves, we continue to adapt while maintaining our high standards of excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 