const { number } = require("joi");
const mongoose = require("mongoose");
const EmployerAuth = require("../models/employerModel");

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  mobileNo: {
    type: Number,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    // enum: ["Manager", "HR", "Sales"], // Example dropdown options
  },
  gender: {
    type: String,
    // enum: ["Male", "Female"],
    required: true,
  },
  course: [
    {
      type: String,
      trim: true,
    },
  ],
  image: {
    image: String,
    ContentType: String,
    imagePath: String,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'EmployerAuth', 
    required: true,
  },
  updated_time: {
    type: Date,
    default: Date.now,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },
});
const employerModel = mongoose.model("createEmployer", employerSchema);

module.exports = employerModel;
