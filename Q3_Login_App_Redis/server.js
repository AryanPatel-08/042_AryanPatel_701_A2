import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";   // <-- FIXED import
import Redis from "ioredis";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 8000;

// Setup Redis client
const redisClient = new Redis({
  host: "127.0.0.1",   // default
  port: 6379,          // default Redis port
});

// Setup Redis session store
const store = new RedisStore({
  client: redisClient,
  prefix: "sess:", // optional key prefix
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store,
    secret: "mySuperSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 }, // 5 minutes
  })
);

// In-memory users (demo only, replace with DB in real apps)
let users = [];

// Layout helper
const layout = (title, body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  ${body}
</body>
</html>`;

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(layout("Home", `<p>Welcome ${req.session.user.email}</p><a href='/logout'>Logout</a>`));
  } else {
    res.send(layout("Home", `<a href='/login'>Login</a> | <a href='/register'>Register</a>`));
  }
});

// Register page
app.get("/register", (req, res) => {
  res.send(layout("Register", `
    <form method="POST" action="/register">
      Email: <input type="email" name="email" required /><br>
      Password: <input type="password" name="password" required /><br>
      <button type="submit">Register</button>
    </form>
  `));
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.send("User already exists. <a href='/login'>Login</a>");
  }
  const hashed = bcrypt.hashSync(password, 10);
  users.push({ email, password: hashed });
  res.send("Registered successfully! <a href='/login'>Login</a>");
});

// Login page
app.get("/login", (req, res) => {
  res.send(layout("Login", `
    <form method="POST" action="/login">
      Email: <input type="email" name="email" required /><br>
      Password: <input type="password" name="password" required /><br>
      <button type="submit">Login</button>
    </form>
  `));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { email };
    res.redirect("/");
  } else {
    res.send("Invalid credentials. <a href='/login'>Try again</a>");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
