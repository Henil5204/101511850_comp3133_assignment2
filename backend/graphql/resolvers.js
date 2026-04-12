const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const auth = (ctx) => { if (!ctx.user) throw new Error('Unauthorized'); return ctx.user; };

module.exports = {
  Query: {
    getAllEmployees: async (_, __, ctx) => { auth(ctx); return Employee.find().sort({ created_at: -1 }); },
    searchEmployeeById: async (_, { eid }, ctx) => { auth(ctx); const e = await Employee.findById(eid); if (!e) throw new Error('Not found'); return e; },
    searchEmployeeByDesignation: async (_, { designation }, ctx) => { auth(ctx); return Employee.find({ designation: { $regex: designation, $options: 'i' } }); },
    searchEmployeeByDepartment: async (_, { department }, ctx) => { auth(ctx); return Employee.find({ department: { $regex: department, $options: 'i' } }); }
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
      if (exists) throw new Error(exists.email === email.toLowerCase() ? 'Email already registered' : 'Username taken');
      const user = await User.create({ username, email, password });
      return { token: sign(user._id), user };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) throw new Error('Invalid credentials');
      return { token: sign(user._id), user };
    },
    addEmployee: async (_, args, ctx) => { auth(ctx); return Employee.create(args); },
    updateEmployee: async (_, { eid, ...updates }, ctx) => {
      auth(ctx);
      Object.keys(updates).forEach(k => updates[k] == null && delete updates[k]);
      const e = await Employee.findByIdAndUpdate(eid, updates, { new: true, runValidators: true });
      if (!e) throw new Error('Not found');
      return e;
    },
    deleteEmployee: async (_, { eid }, ctx) => {
      auth(ctx);
      const e = await Employee.findByIdAndDelete(eid);
      if (!e) throw new Error('Not found');
      return { message: `${e.first_name} ${e.last_name} deleted`, id: eid };
    }
  }
};
