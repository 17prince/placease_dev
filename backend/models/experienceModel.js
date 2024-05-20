const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  profile: {
    type: String,
    required: [true, "Profile field is required"],
  },
  organization: {
    type: String,
    required: [true, "Organization field is required"],
  },
  location: {
    type: String,
    required: [true, "Location field is required"],
  },
  startDate: Date,
  endDate: { type: mongoose.Schema.Types.Mixed, default: null },
  description: {
    type: String,
    maxlength: [450, "Maximum length of description can be 450"],
    minlength: [0, "Minimum length of description can be 100"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Students",
    required: [true, "Project must belong to a student"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
