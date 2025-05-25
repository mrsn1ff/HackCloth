const nodemailer = require('nodemailer');

// Configure transporter based on environment
const transporter = nodemailer.createTransport(
  process.env.EMAIL_SERVICE === 'SendGrid'
    ? {
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
    : process.env.EMAIL_SERVICE === 'gmail'
    ? {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
    : {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
);

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
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendLoginCode };
