const catchAsync = require("../utils/catchAsync");

const Company = require("../models/companyModel");

exports.getAllJobDetails = catchAsync(async (req, res, next) => {
  const jobs = await Company.find();

  res.status(200).json({
    status: "success",
    jobs,
  });
});
