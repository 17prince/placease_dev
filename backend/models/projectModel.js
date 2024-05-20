const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, "Project title must be unique."],
    required: [true, "Project title is required"],
  },
  projectLink: String,
  startDate: Date,
  endDate: { type: mongoose.Schema.Types.Mixed, default: null },
  description: {
    type: String,
    maxlength: [450, "Maximum length of description can be 450"],
    minlength: [100, "Minimum length of description can be 100"],
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

module.exports = mongoose.model("Projects", projectSchema);
