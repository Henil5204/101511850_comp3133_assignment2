require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comp3133_assignment2';

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Employee.deleteMany({});

  await User.create([
    { username: 'admin',   email: 'admin@emptrack.com',   password: 'Admin123!' },
    { username: 'manager', email: 'manager@emptrack.com', password: 'Manager123!' }
  ]);

  await Employee.create([
    { first_name: 'Alice',  last_name: 'Chen',     email: 'alice.chen@emptrack.com',   gender: 'Female', designation: 'Senior Software Engineer', department: 'Engineering',     salary: 105000, date_of_joining: '2021-03-15' },
    { first_name: 'Bob',    last_name: 'Okafor',   email: 'bob.okafor@emptrack.com',   gender: 'Male',   designation: 'Product Manager',          department: 'Product',         salary: 115000, date_of_joining: '2020-07-01' },
    { first_name: 'Priya',  last_name: 'Nair',     email: 'priya.nair@emptrack.com',   gender: 'Female', designation: 'Product Designer',         department: 'Design',          salary: 92000,  date_of_joining: '2022-01-10' },
    { first_name: 'James',  last_name: 'Kowalski', email: 'james.k@emptrack.com',      gender: 'Male',   designation: 'DevOps Engineer',          department: 'Engineering',     salary: 98000,  date_of_joining: '2021-11-20' },
    { first_name: 'Sofia',  last_name: 'Reyes',    email: 'sofia.reyes@emptrack.com',  gender: 'Female', designation: 'Marketing Specialist',     department: 'Marketing',       salary: 72000,  date_of_joining: '2023-02-14' },
    { first_name: 'Marcus', last_name: 'Williams', email: 'marcus.w@emptrack.com',     gender: 'Male',   designation: 'Financial Analyst',        department: 'Finance',         salary: 88000,  date_of_joining: '2022-06-05' },
    { first_name: 'Yuki',   last_name: 'Tanaka',   email: 'yuki.tanaka@emptrack.com',  gender: 'Other',  designation: 'Data Scientist',           department: 'Engineering',     salary: 112000, date_of_joining: '2020-09-15' },
    { first_name: 'Emma',   last_name: 'Larsson',  email: 'emma.larsson@emptrack.com', gender: 'Female', designation: 'HR Specialist',            department: 'Human Resources', salary: 68000,  date_of_joining: '2023-08-01' }
  ]);

  console.log('Seeded: admin/Admin123! and manager/Manager123!');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
