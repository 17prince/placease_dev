const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./factoryHandle");
const { filterObject } = require("../utils/filterObject");

// Models
const Students = require("../models/studentModel");
const Projects = require("../models/projectModel");
const Experience = require("../models/experienceModel");

// Get the user id from req.user
exports.getMyId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// Get the details of current user
exports.getUser = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next();

  const user = await Students.findById(req.params.id);

  if (!user) return next(new AppError("No user found !", 400));

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// update the current user
exports.updateMe = catchAsync(async (req, res, next) => {
  // If the req.body contains password field because it can not be update from this route
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError("Password can not be updated from this route"),
      400
    );

  // filter the object
  const filterObj = filterObject(
    req.body,
    "name",
    "phone",
    "address",
    "avatar",
    "branch",
    "course",
    "class",
    "batchYear",
    "currentYear",
    "dob",
    "semester",
    "enrollment",
    "scholarNo"
  );

  const user = await Students.findByIdAndUpdate(req.user._id, filterObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// delete me
exports.deleteMe = catchAsync(async (req, res, next) => {
  await Students.findOneAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// -------------------------------------------------PROJECTS---------------------------------------------------------------------------

// Get all the projects that belong to a student
exports.getAllMyProject = catchAsync(async (req, res, next) => {
  const projects = await Projects.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    data: projects,
  });
});

// Create a new project
exports.createMyProject = catchAsync(async (req, res, next) => {
  if (!req.body)
    return next(new AppError("Please provied project details", 400));

  // add user refrence to project
  req.body.user = req.user._id;

  const newProject = await Projects.create(req.body);

  res.status(200).json({
    status: "success",
    data: newProject,
  });
});

exports.updatemyProject = catchAsync(async (req, res, next) => {
  if (!req.body)
    return next(new AppError("Please provied project details", 400));

  const updateProject = await Projects.findByIdAndUpdate(
    req.params.id,
    filterObject(req.body, "title", "startDate", "endDate", "description"),
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updateProject,
  });
});

exports.deleteMyProject = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    return next(new AppError("Please provide project id", 400));

  await Projects.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
  });
});

// -----------------------------------------------------End Project section--------------------------------------------------------------

// -----------------------------------------------------Experience----------------------------------------------------------------------

exports.getAllMyExperiences = catchAsync(async (req, res, next) => {
  const experiences = await Experience.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    data: experiences,
  });
});

exports.createMyExperience = catchAsync(async (req, res, next) => {
  if (!req.body)
    return next(new AppError("Please provied work experience details", 400));

  // add user refrence to project
  req.body.user = req.user._id;

  const newExperience = await Experience.create(req.body);

  res.status(200).json({
    status: "success",
    data: newExperience,
  });
});

exports.updatemyExperience = catchAsync(async (req, res, next) => {
  if (!req.body)
    return next(new AppError("Please provied Expirence details", 400));

  const updateExpirence = await Experience.findByIdAndUpdate(
    req.params.id,
    filterObject(
      req.body,
      "profile",
      "organization",
      "location",
      "startDate",
      "endDate",
      "description"
    ),
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updateExpirence,
  });
});

exports.deleteMyExperience = catchAsync(async (req, res, next) => {
  if (!req.params.id)
    return next(new AppError("Please provide project id", 400));

  await Experience.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
  });
});

// Get all the students details
exports.getAllStudents = factory.getAllUsers(Students);

// Get details of single students
exports.getOneStudent = factory.getUser(Students);

exports.createOne = factory.createUser(
  Students,
  "name",
  "email",
  "password",
  "confirmPassword"
);

// Update the Students details
exports.updateOne = factory.updateUser(Students, "branch");

// Delete the student
exports.deleteOne = factory.deleteUser(Students);
