import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// Create new employee
router.post("/add", async (req, res) => {
  try {
    const { empId, name, email, password, salary } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const emp = new Employee({
      empId,
      name,
      email,
      password,  // plain text will be hashed by pre("save")
      salary,
    });

    await emp.save();
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
