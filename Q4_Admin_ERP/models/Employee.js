import mongoose from "mongoose";

const empSchema = new mongoose.Schema({
  empid: String,
  name: String,
  email: String,
  password: String, // encrypted
  salary: Number,
  leaves: { type: Number, default: 0 }
});

export default mongoose.model("Employee", empSchema);
