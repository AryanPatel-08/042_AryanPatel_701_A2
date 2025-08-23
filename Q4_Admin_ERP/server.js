import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import adminAuth from "./routes/adminAuth.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/erp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Sessions (stored in MongoDB)
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/erp" })
}));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Routes
app.use("/admin", adminAuth);

// Start server
app.listen(8000, () => console.log("Server running on http://localhost:8000"));
