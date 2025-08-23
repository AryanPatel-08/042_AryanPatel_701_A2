// hash.js
const bcrypt = require("bcryptjs");

const password = "ram1234"; // change this to whatever password you want to hash

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
