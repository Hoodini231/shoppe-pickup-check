import nodemailer from "nodemailer";

const MEGAN_EMAIL = process.env.NEXT_PUBLIC_MEGAN_EMAIL || ""
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPNAY_EMAIL || ""
const COMPANY_KEY =  process.env.NEXT_PUBLIC_EMAIL_PASSWORD || ""

// Define an async function to send email
async function sendEmail(
): Promise<void> {
  // Create a transporter using SMTP (example: Gmail SMTP)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",       // SMTP server host
    port: 465,                    // SMTP secure port
    secure: true,                 // true for 465, false for other ports
    auth: {
      user: COMPANY_EMAIL, // Your email address (from environment variable)
      pass: COMPANY_KEY, // Your email password or app-specific password
    },
  });

  // Define email options
  const mailOptions = {
    from: `"SPX Notification" <${MEGAN_EMAIL}>`,  // sender with display name and email
    to: COMPANY_EMAIL,                   // recipient email address
    subject: "Collection Point has freed up!",            // email subject
    html: `
      <h1>Hi there Megan!</h1>
      <p>Your order has been shipped and is on its way.</p>
      <p>Thank you for shopping with us.</p>
    `,                                             // HTML email content
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

