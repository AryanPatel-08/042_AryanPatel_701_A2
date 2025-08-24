import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("ram1234", 10);
console.log("New Hash:", hash);
