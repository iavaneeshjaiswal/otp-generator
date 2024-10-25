import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config()
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otps = {}; // Temporary storage for OTPs

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
}

function storeOTP(phone, otp) {
  const expiration = Date.now() + 1 * 60 * 1000; // OTP valid for 1 minutes
  otps[phone] = { otp, expiration };
}

function verifyOTP(phone, otp) {
  const data = otps[phone]; // Retrieve the OTP data for the provided phone number
  if (data && data.otp === otp && Date.now() < data.expiration) {
    delete otps[phone]; // Remove OTP after verification
    return true; // Verification success
  }
  return false; // Verification failure
}

async function sendOTPSMS(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 1 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return message.sid;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

export default { generateOTP, storeOTP, verifyOTP, sendOTPSMS };
