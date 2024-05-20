const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("node:path");

// Models
const Student = require("../models/studentModel");
const Company = require("../models/companyModel");

// Sample Data
const sampleStudents = require("./studentsData");
const sampleJobs = require("./companyData");

// Configure the environment variables
dotenv.config({ path: path.join(__dirname, "../config.env") });

// Datebase URI string
const DB = process.env.DATABASE.replace(
  /<PASSWORD>/,
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    autoCreate: true,
  })
  .then(() => {
    console.log("Datebase Connected");
  })
  .catch((err) => {
    console.log(`Can not connect to the database : ${err}`);
  });

const importData = async (model, data) => {
  try {
    await model.create(data);
    console.log("Data Inserted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async (model) => {
  try {
    await model.deleteMany();
    console.log("Data deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData(Student, sampleStudents);
} else if (process.argv[2] === "--delete") {
  deleteData(Student);
}
