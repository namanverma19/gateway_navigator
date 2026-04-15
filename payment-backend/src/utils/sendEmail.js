import nodemailer from 'nodemailer';

/**
 * @desc    Reusable function to send emails
 * @param   {Object} options - { email, subject, message }
 */
const sendEmail = async (options) => {
  // 1. Create a transporter (Email Service Provider Settings)
  const transporter = nodemailer.createTransport({
    // Agar Gmail use kar rahe ho toh 'Gmail' likho
    // Agar Mailtrap (Testing) use kar rahe ho toh Host/Port dalo
    service: process.env.EMAIL_SERVICE, 
    auth: {
      user: process.env.EMAIL_USER, // .env se uthayega
      pass: process.env.EMAIL_PASS, // .env se uthayega (App Password)
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: `"Gateway Navigator" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Hum HTML bhejenge taaki buttons/styling dikhe
  };

  // 3. Send the actual email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;