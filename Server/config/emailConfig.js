import nodemailer from "nodemailer";


const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or use SMTP settings for other providers
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD // Your app password (not regular password)
    }
  });
};

export default createTransporter;