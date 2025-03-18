require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');

// Connect to database
mongoose.connect('mongodb://localhost:27017/coaching-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Default admin email and password
const adminEmail = '21bds063@iiitdwd.ac.in';
const adminPassword = 'Shubham321$';
const adminName = 'Admin User';

// Sample course data
// const courses = [
//   {
//     title: 'Complete Mathematics for Grade 10',
//     class: 10,
//     subject: 'Mathematics',
//     description: 'A comprehensive course covering all aspects of the Grade 10 mathematics curriculum including algebra, geometry, and statistics.',
//     duration: '3 months',
//     schedule: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
//     image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
//   },
//   {
//     title: 'Physics for Grade 11 & 12',
//     class: 11,
//     subject: 'Physics',
//     description: 'Master the concepts of physics for high school students, with a focus on mechanics, electricity, magnetism, and modern physics.',
//     duration: '4 months',
//     schedule: 'Tue, Thu (4:00 PM - 6:00 PM)',
//     image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
//   },
//   {
//     title: 'English Language and Literature',
//     class: 9,
//     subject: 'English',
//     description: 'Improve your English language skills and develop a deeper understanding of literature. This course covers grammar, writing, and literary analysis.',
//     duration: '3 months',
//     schedule: 'Tue, Thu (5:00 PM - 6:30 PM)',
//     image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80'
//   }
// ];

// Sample announcement data
// const announcements = [
//   {
//     title: 'Summer Vacation Batch Starting Soon',
//     content: 'We are excited to announce our intensive summer vacation batches starting from June 1st. Limited seats available, register now!',
//     category: 'Courses',
//     date: new Date('2023-05-15')
//   },
//   {
//     title: 'Parent-Teacher Meeting',
//     content: 'A parent-teacher meeting will be held on May 25th from 10:00 AM to 2:00 PM. All parents are requested to attend.',
//     category: 'Events',
//     date: new Date('2023-05-10')
//   },
//   {
//     title: 'Holiday Notice',
//     content: 'The institute will remain closed from May 1st to May 3rd for the Labor Day weekend. Regular classes will resume on May 4th.',
//     category: 'Holidays',
//     date: new Date('2023-04-25')
//   }
// ];

const seedDatabase = async () => {
  try {
    // Clear existing data
    // await Admin.deleteMany({});
    // await Course.deleteMany({});
    // await Announcement.deleteMany({});

    // console.log('Existing data cleared');

    // Create admin (password will be hashed by pre-save middleware)
    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword
    });

    console.log(`Admin account created: ${adminEmail}`);

    // Create courses
    // await Course.insertMany(courses);
    // console.log(`${courses.length} courses created`);

    // Create announcements
    // await Announcement.insertMany(announcements);
    // console.log(`${announcements.length} announcements created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 