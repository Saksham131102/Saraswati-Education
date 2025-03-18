import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminNav from './components/AdminNav';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import Developers from './pages/Developers';
import Team from './pages/Team';
import Testimonials from './pages/Testimonials';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/Courses';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminContacts from './pages/admin/Contacts';
import AdminSettings from './pages/admin/Settings';
import AdminTeam from './pages/admin/Team';
import AdminTestimonials from './pages/admin/Testimonials';
import AuthMiddleware from './middlewares/AuthMiddleware';
import NewsletterSubscriptions from './pages/admin/NewsletterSubscriptions';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/team" element={<Team />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AuthMiddleware>
              <div className="min-h-screen bg-gray-100">
                <AdminNav />
                <div className="pt-4">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                    <Route path="/courses" element={<AdminCourses />} />
                    <Route path="/announcements" element={<AdminAnnouncements />} />
                    <Route path="/contacts" element={<AdminContacts />} />
                    <Route path="/newsletter" element={<NewsletterSubscriptions />} />
                    <Route path="/team" element={<AdminTeam />} />
                    <Route path="/testimonials" element={<AdminTestimonials />} />
                    <Route path="/settings" element={<AdminSettings />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </div>
              </div>
            </AuthMiddleware>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
