const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  major: { type: String },
  university: { type: String },
  gpa: { type: String } 
}, { _id: false });

const workExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String }, 
  companyName: { type: String },
  duration: { type: String } 
}, { _id: false });

const certificateSchema = new mongoose.Schema({
  title: { type: String },
  provider: { type: String }, 
  date: { type: String } 
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  updateCount: { type: Number, default: 0 },
  
  fullName: { type: String },
  phoneNumber: { type: String },
  birthDate: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  address: { type: String },
  expectedSalary: { type: String }, 
  cooperationType: { type: String }, 
  
  hasInsuranceHistory: { type: Boolean, default: false }, 
  willingToGoOnMission: { type: Boolean, default: false },
  
  skills: [{ type: String }],
  
  education: [educationSchema],
  workExperience: [workExperienceSchema],
  certificates: [certificateSchema],

  fileUrl: { type: String, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
