import { useState } from 'react';
// import { teamAPI } from '../services/api';

interface Developer {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string;
}

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([
    {
      _id: '1',
      name: 'Saksham',
      role: 'Full Stack Developer',
      bio: 'A passionate developer with expertise in building modern web applications. Specialized in React, Node.js, and MongoDB. Committed to creating efficient and user-friendly solutions.',
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=Saksham',
      skills: 'React, Node.js, MongoDB, TypeScript, Express.js'
    },
    {
      _id: '2',
      name: 'Shubham Kumar',
      role: 'Full Stack Developer',
      bio: 'Experienced in developing scalable web applications with a focus on performance and security. Skilled in both frontend and backend technologies, with a strong foundation in software architecture.',
      image: 'https://api.dicebear.com/9.x/initials/svg?seed=Shubham',
      skills: 'React, Node.js, MongoDB, JavaScript, REST APIs'
    }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Developers</h1>
          <p className="text-xl text-gray-600">
            Meet the talented developers who built this platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {developers.map((developer) => (
            <div key={developer._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-64">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{developer.name}</h2>
                  <p className="text-blue-200 font-semibold">{developer.role}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {developer.skills.split(', ').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{developer.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developers; 