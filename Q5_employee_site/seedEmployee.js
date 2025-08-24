require('dotenv').config();
const connectDB = require('./config/db');
const Employee = require('./models/Employee');

async function seed(){
  await connectDB(process.env.MONGO_URI);
  const exists = await Employee.findOne({ email: 'aryan@gmail.com' });
  if (exists) {
    console.log('Employee already exists');
    process.exit(0);
  }
  const emp = new Employee({
    name: 'abc',
    email: 'abc@gmail.com',
    password: 'abc123', // will be hashed by pre-save hook
    empId: 'EMP' + Date.now().toString().slice(-6)
  });
  await emp.save();
  console.log('Seeded employee: email=abc@gmail.com password=abc123');
  process.exit(0);
}
seed();
