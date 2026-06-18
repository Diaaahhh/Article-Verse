import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.chulkani.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject:
      "Article Verse Email Verification",

    html: `
      <div style="font-family:sans-serif">
        <h2>Email Verification</h2>

        <p>Your OTP code is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP expires in 5 minutes.
        </p>
      </div>
    `,
  });
};