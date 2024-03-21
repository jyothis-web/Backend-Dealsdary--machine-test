const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
     trim:true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
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
const employerModel = mongoose.model("Employer-auth", employerSchema);

module.exports = employerModel;
