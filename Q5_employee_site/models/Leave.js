import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  grant: { type: String, enum: ["Pending", "Yes", "No"], default: "Pending" }
});

export default mongoose.model("Leave", leaveSchema);
