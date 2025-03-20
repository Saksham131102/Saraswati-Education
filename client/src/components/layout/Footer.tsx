import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
// import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-3">
            <h2 className="text-xl font-bold mb-4">Saraswati Edu</h2>
            <p className="text-gray-300 mb-4">
              Empowering students to achieve academic excellence.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors">
                <FaXTwitter className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-[#FD1B81] transition-colors">
                <FaInstagram className="text-xl" />
              </a> */}
              <a href="https://wa.me/9234954935" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-[#23D366] transition-colors">
                <FaWhatsapp className="text-xl" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100006934716893" target="_blank" rel="noopener noreferrer" 
                className="text-gray-300 hover:text-[#0860F2] transition-colors">
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-gray-300 hover:text-white">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaPhone className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>+91 923 495 4935</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>+91 827 184 0703</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>saurabhkumardona11@gmail.com</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>Kumhartoli, Parnala, Pepal Chowk, Near Muskan palace, H.Bag</span>
              </li>
              <li className="flex items-start">
                <FaClock className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
                <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="col-span-1 md:col-span-4">
            <h3 className="text-lg font-semibold mb-4">Our Location</h3>
            <div className="rounded-lg overflow-hidden h-64 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d455.6522990331637!2d85.34310168473434!3d23.988063960037195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f49eb037690d93%3A0xb8302684145ca421!2sX8QV%2B5CW%2C%20Kumhartoli%20Rd%2C%20KumharToli%2C%20Hazaribagh%2C%20Jharkhand%20825301!5e0!3m2!1sen!2sin!4v1742314751957!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Saraswati Edu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
