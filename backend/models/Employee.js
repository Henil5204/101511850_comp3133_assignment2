const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name:      { type: String, required: true, trim: true },
  last_name:       { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  gender:          { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  designation:     { type: String, required: true, trim: true },
  department:      { type: String, required: true, trim: true },
  salary:          { type: Number, required: true, min: 0 },
  date_of_joining: { type: String, required: true },
  employee_photo:  { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Employee', employeeSchema);
