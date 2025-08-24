import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

export const loginEmployee = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email
    email = email.trim().toLowerCase();
    console.log("🔍 Login attempt for:", email);

   const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare password with bcrypt
    const isMatch = await employee.matchPassword(password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: employee._id, empId: employee.empId, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, employee });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
