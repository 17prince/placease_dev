const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { filterObject } = require("../utils/filterObject");
const APIFeature = require("../utils/apiFeatures");

// Get all the students details
exports.getAllUsers = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.query);
    const feature = new APIFeature(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const allData = await feature.query;
    const totalResults = await Model.countDocuments();

    res.status(200).json({
      status: "success",
      results: allData?.length,
      totalResults,
      data: allData,
    });
  });

// Get details of single user
exports.getUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.query;

    if (!email) return next(new AppError("Please provied a email", 400));

    const user = await Model.find({ email });

    if (!user.length)
      return next(
        new AppError("No student found with this email address", 400)
      );

    res.status(200).json({
      status: "success",
      data: user,
    });
  });

// create a new student
exports.createUser = (Model, ...keepFields) =>
  catchAsync(async (req, res, next) => {
    if (!req.body)
      return next(new AppError("Please provied the required details", 400));

    // Check if the student with email is already exist
    const isAlreadyExist = await Model.findOne({ email: req.body.email });

    if (isAlreadyExist)
      return next(
        new AppError("Student with this detials is already exist", 401)
      );

    // Filter req.body
    const filterObj = filterObject(req.body, ...keepFields);

    // Create Student
    const newStudent = await Model.create(filterObj);

    newStudent.password = undefined;

    res.status(201).json({
      status: "success",
      data: { student: newStudent },
    });
  });

// Update the student (only by admin)
exports.updateUser = (Model, ...keepFields) =>
  catchAsync(async (req, res, next) => {
    const filterObj = filterObject(req.body, ...keepFields);

    // Get the email from req.query
    const { email } = req.query;
    if (!email) return next(new AppError("Please provied a email", 400));

    const updateUser = await Model.findOneAndUpdate({ email }, filterObj, {
      new: true, // returns the update document, if not true returns the unupdated version of document
      runValidators: true,
    });

    if (!updateUser) {
      return next(new AppError("No data found with given paramerter.", 404));
    }

    res.status(200).json({
      status: "success",
      data: updateUser,
    });
  });

//   Delete the student
exports.deleteUser = (Model) =>
  catchAsync(async (req, res, next) => {
    // get the email
    const { email } = req.query;

    // Find the student and set active field to fasle
    await Model.findOneAndUpdate({ email }, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
