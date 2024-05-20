const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    require: [true, "Job title is required"],
  },
  // jobDescription: {
  //   type: String,
  //   require: [true, "Job description is required"],
  // },
  companyName: {
    type: String,
    require: [true, "Company name is required"],
  },
  location: String,
  batch: String,
  salary: String,
  role: String,
  visitedIn: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Company", companySchema);
