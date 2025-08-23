import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: employee._id, empId: employee.empId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
