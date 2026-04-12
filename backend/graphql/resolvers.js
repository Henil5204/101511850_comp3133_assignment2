const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const Employee = require('../models/Employee');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const auth = (ctx) => {
  if (!ctx.user) throw new Error('Unauthorized: Please log in first.');
  return ctx.user;
};

module.exports = {
  Query: {
    getAllEmployees: async (_, __, ctx) => {
      auth(ctx);
      return Employee.find().sort({ created_at: -1 });
    },

    searchEmployeeById: async (_, { eid }, ctx) => {
      auth(ctx);
      const emp = await Employee.findById(eid);
      if (!emp) throw new Error('Employee not found');
      return emp;
    },

    searchEmployeeByDesignation: async (_, { designation }, ctx) => {
      auth(ctx);
      return Employee.find({ designation: { $regex: designation, $options: 'i' } }).sort({ last_name: 1 });
    },

    searchEmployeeByDepartment: async (_, { department }, ctx) => {
      auth(ctx);
      return Employee.find({ department: { $regex: department, $options: 'i' } }).sort({ last_name: 1 });
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
      if (exists) throw new Error(
        exists.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken'
      );
      const user  = await User.create({ username, email, password });
      const token = sign(user._id);
      return { token, user };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({
        $or: [{ username }, { email: username.toLowerCase() }]
      });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid username or password');
      }
      const token = sign(user._id);
      return { token, user };
    },

    addEmployee: async (_, args, ctx) => {
      auth(ctx);
      const exists = await Employee.findOne({ email: args.email.toLowerCase() });
      if (exists) throw new Error(`Employee with email "${args.email}" already exists`);
      return Employee.create(args);
    },

    updateEmployee: async (_, { eid, ...updates }, ctx) => {
      auth(ctx);
      Object.keys(updates).forEach(k => updates[k] == null && delete updates[k]);
      const emp = await Employee.findByIdAndUpdate(eid, updates, { new: true, runValidators: true });
      if (!emp) throw new Error('Employee not found');
      return emp;
    },

    deleteEmployee: async (_, { eid }, ctx) => {
      auth(ctx);
      const emp = await Employee.findByIdAndDelete(eid);
      if (!emp) throw new Error('Employee not found');
      return { message: `${emp.first_name} ${emp.last_name} deleted successfully`, id: eid };
    }
  }
};
