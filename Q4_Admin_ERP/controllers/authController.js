import transporter from "../config/mail.js";

export const loginStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Your login logic (find user, check password, etc.)
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit

    // Save otp & expiry in DB
    // await User.updateOne({ email }, { otp, otpExpiry: Date.now() + 5*60*1000 });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Admin OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error in loginStep1:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
