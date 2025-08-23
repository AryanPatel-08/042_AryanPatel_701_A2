import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
  try {
    const leave = new Leave({
      empId: req.user.empId,
      date: req.body.date,
      reason: req.body.reason
    });
    await leave.save();
    res.json({ message: "Leave applied", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ empId: req.user.empId });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
