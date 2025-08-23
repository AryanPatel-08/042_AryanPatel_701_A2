import express from "express";
import session from "express-session";
import FileStoreFactory from "session-file-store";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import fs from "fs";

const app = express();
const PORT = 8000;

// Setup file store for sessions
const FileStore = FileStoreFactory(session);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new FileStore({ path: "./sessions" }), 
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 }, // 5 minutes
  })
);

// Load users from file
const USERS_FILE = "./users.json";
let users = fs.existsSync(USERS_FILE)
  ? JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
  : [];

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`<h2>Welcome ${req.session.user.email}!</h2>
              <a href='/logout'>Logout</a>`);
  } else {
    res.send(`<h2>Login App</h2>
              <a href='/login'>Login</a> | 
              <a href='/register'>Register</a>`);
  }
});

// Register
app.get("/register", (req, res) => {
  res.send(`<form method="POST" action="/register">
              Email: <input type="email" name="email" required/><br>
              Password: <input type="password" name="password" required/><br>
              <button type="submit">Register</button>
            </form>`);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.send("User already exists. <a href='/login'>Login</a>");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ email, password: hashedPassword });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.send("Registered successfully! <a href='/login'>Login</a>");
});

// Login
app.get("/login", (req, res) => {
  res.send(`<form method="POST" action="/login">
              Email: <input type="email" name="email" required/><br>
              Password: <input type="password" name="password" required/><br>
              <button type="submit">Login</button>
            </form>`);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { email };
    res.redirect("/");
  } else {
    res.send("Invalid credentials. <a href='/login'>Try again</a>");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
