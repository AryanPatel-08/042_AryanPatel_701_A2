import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Middleware: check if logged in
function isAuth(req, res, next) {
  if (req.session.admin) return next();
  res.redirect("/admin/login");
}

// Login page
router.get("/login", (req, res) => res.render("login"));
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && await bcrypt.compare(password, admin.password)) {
    req.session.admin = admin;
    return res.redirect("/admin/dashboard");   // ✅ fixed
  }
  res.render("login", { error: "Invalid login" });
});

// Dashboard
router.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard", { admin: req.session.admin });
});

// List Employees
router.get("/employees", isAuth, async (req, res) => {
  const emps = await Employee.find();
  res.render("employees/list", { emps });
});

// Add Employee Form
router.get("/employees/add", isAuth, (req, res) => res.render("employees/add"));
router.post("/employees/add", isAuth, async (req, res) => {
  const { name, email, salary } = req.body;

  // Generate empid + random password
  const empid = "EMP" + Math.floor(Math.random() * 10000);
  const rawPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const emp = new Employee({ empid, name, email, salary, password: hashedPassword });
  await emp.save();

  // Send email to employee
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "your@gmail.com", pass: "yourpassword" }
  });
  await transporter.sendMail({
    from: "your@gmail.com",
    to: email,
    subject: "Welcome to ERP",
    text: `Hello ${name}, Your Employee ID: ${empid}, Password: ${rawPassword}`
  });

  res.redirect("/admin/employees");
});

// Delete Employee
router.get("/employees/delete/:id", isAuth, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/admin/employees");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

export default router;
