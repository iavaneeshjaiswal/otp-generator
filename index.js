require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPSMS,
} = require("./controllers/otpManager");

const app = express();
app.use(bodyParser.json());

// Route to request OTP via SMS
app.post("/request-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();
  storeOTP(phone, otp);
  try {
    await sendOTPSMS(phone, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (verifyOTP(phone, otp)) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
