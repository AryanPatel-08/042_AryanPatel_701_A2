import Employee from "../models/Employee.js";

export const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
