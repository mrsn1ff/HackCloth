const nodemailer = require('nodemailer');

// Simplified transporter configuration for Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLoginCode = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"HackCloth" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your HackCloth Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p>Here's your 6-digit login code:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 2px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in ${process.env.CODE_EXPIRATION_MINUTES} minutes.</p>
        </div>
      `,
    });
    console.log('Email sent successfully to', email);
  } catch (error) {
    console.error('Email sending failed:', {
      message: error.message,
      stack: error.stack,
      email: email,
      config: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER,
        usingMailtrap: process.env.EMAIL_HOST.includes('mailtrap'),
      },
    });
    throw error;
  }
};

module.exports = { sendLoginCode };
