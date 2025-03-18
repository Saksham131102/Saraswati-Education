const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an email address'
    });
  }

  try {
    console.log('Newsletter subscription attempt for:', email);
    
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      console.log('Email already subscribed:', email);
      return res.status(400).json({
        success: false,
        error: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscription
    console.log('Creating new subscription for:', email);
    const subscription = await Newsletter.create({
      email
    });
    
    console.log('Subscription created with ID:', subscription._id);

    // Send welcome email
    try {
      console.log('Attempting to send welcome email to:', email);
      
      // Check if SMTP credentials are configured
      if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_actual_email@gmail.com') {
        console.error('SMTP not properly configured. Email not sent.');
        throw new Error('SMTP not properly configured');
      }
      
      console.log('SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER ? '****' : 'Not set', // Don't log actual credentials
          pass: process.env.SMTP_PASS ? '****' : 'Not set'  // Don't log actual credentials
        }
      });
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: `
          <h1>Welcome to Our Newsletter!</h1>
          <p>Thank you for subscribing to our newsletter. You'll now receive updates about our courses, announcements, and educational content.</p>
          <p>Best regards,<br>Your Coaching Team</p>
        `
      });
      console.log('Welcome email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError).reduce((a, p) => {
        a[p] = emailError[p];
        return a;
      }, {}), 2));
      // We don't want to fail the subscription if email sending fails
      // Just log the error and continue
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error).reduce((a, p) => {
      a[p] = error[p];
      return a;
    }, {}), 2));
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  const { email } = req.body;

  try {
    const subscription = await Newsletter.findOne({ email });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    subscription.isActive = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all newsletter subscriptions
// @route   GET /api/newsletter/subscriptions
// @access  Private (Admin only)
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Newsletter.find().sort('-subscribedAt');
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete a newsletter subscription
// @route   DELETE /api/newsletter/subscription/:id
// @access  Private (Admin only)
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    await Newsletter.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 