const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true // show debug output
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection successful');
  }
});

// Send test email
const sendTestEmail = async (req, res) => {
  try {
    // Get recipient email from request body, or use a default test email
    const { email = 'test@example.com',connectedUserEmail } = req.body;
    
    console.log(`Attempting to send email to: ${email}`);
    console.log(`Using email credentials: ${process.env.EMAIL_USER}`);
    
    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'HEY ! WE FOUND A FELLOW LEARNER',
      text: 'email connecting users',
      html: `<h1>Details of the user you connected with</h1><p>Email: ${connectedUserEmail}</p>`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    
    // More detailed error information
    let errorMessage = error.message;
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your email and password in .env file. For Gmail, you need to use an App Password.';
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: errorMessage
    });
  }
};

module.exports = {
  sendTestEmail
}; 