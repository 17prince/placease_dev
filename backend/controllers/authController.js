const jwt = require("jsonwebtoken");
const { promisify } = require("node:util");
const Students = require("../models/studentModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const { filterObject } = require("../utils/filterObject");

// Sign the jwt token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS256", //default algo
    expiresIn: process.env.JWT_EXPIERS_IN,
  });

const createAndSendToken = (student, statusCode, req, res) => {
  const token = signToken(student._id);

  const cookieOptions = {
    expries: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIERS_IN * 24 * 60 * 60 * 1000
    ),
    httponly: true,
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  if (student.password) student.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      student,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("Request body is empty !", 401));

  // 1. check for the duplicate student through its email
  const isStudent = await Students.findOne({ email: req.body.email });

  if (isStudent)
    return next(new AppError("Student with this email is already exist", 401));

  // Now filter req.body object
  const filteredStudent = filterObject(
    req.body,
    "name",
    "email",
    "password",
    "confirmPassword"
  );
  // 2. create new student
  const newStudent = await Students.create(filteredStudent);

  // 3. Create and send the json token
  createAndSendToken(newStudent, 201, req, res);
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  // 1. Get the email and password from request body
  const { email, password } = req.body;

  // 2. check email and password are not empyt and exist
  if (!email || !password)
    return next(new AppError("Please provide email and password", 401));

  // 3. Get the student based upon the given email
  const student = await Students.findOne({ email }).select("+password");

  // 4. Check the password
  if (!student || !(await student.checkPassword(password, student.password)))
    return next(
      new AppError("Invalid email or password, please try again !", 401)
    );

  // 5. If all ok, create and send token
  createAndSendToken(student, 200, req, res);
});

// LogOut
exports.logout = catchAsync(async (req, res, next) => {
  // overwrite the cookie
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httponly: true,
  });

  res.status(200).json({ status: "success" });
});

// Protect routes (autherization)
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Get the token from hearder or cookie and check if the user is there
  if (
    req?.headers.authorization &&
    req?.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // FOR APIs
    if (req.originalUrl.startsWith("/api"))
      return next(
        new AppError(
          "You are not logged in, please login first and try again!",
          400
        )
      );

    //   FOR WEBSITE
    return res.redirect("/");
  }

  // Verify the token and extract the user id
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Get the user by its id
  const currentUser = await Students.findById(decode.id);

  if (!currentUser)
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );

  // if user update its current password then dont allow them authentication
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError("User recently changed password, please login again!", 400)
    );
  }

  // Grant access to the all protected routes
  req.user = currentUser;

  next();
});

// only to render pages, is user logged in or not. No error should be return
exports.isLogged = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1. Token Verification
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        proccess.env.JWT_SECRET
      );

      // 2. Check if the user exist,, by its id
      const freshUser = await Students.findById(decode.id);

      // 3. if no user is found
      if (!freshUser) return next();

      // 4. Check if the user change the password and new token was issued
      if (freshUser.changedPasswordAfter(decode.iat)) return next();

      // That means user exisit
      res.locals.user = freshUser;

      return next();
    } catch {
      return next();
    }
  }
});

// Allow specific action to palcement coordinator and palcement department
exports.restrictExecpt =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permisson to access this route", 404)
      );
    }

    next();
  };

// Forget password functionality to send a reset token with email
exports.forgetpassword = catchAsync(async (req, res, next) => {
  // 1. Get the user through its email id
  const user = await Students.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError("User with this email address does not exisit !", 400)
    );

  // 2. Generate a random token
  const resetToken = user.createPasswordResetToken();

  // Since we are using methods so we need to save the user
  await user.save({ validateBeforeSave: false });

  // 3. Send this token through the email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/passwordreset/${resetToken}`;
    await new Email(user, resetURL).sendResetPassword();

    if (process.env.NODE_ENV === "production")
      return res.status(200).json({
        status: "success",
        message: "Email sent to your email address",
      });
    res.status(200).json({
      status: "success",
      message: "Token send successfully.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.resetTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error occurre in sending email please try again in a few minutes",
        500
      )
    );
  }
});

// on forget reset token and reset the new password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get the user based on token
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    resetTokenExpires: { $gt: Date.now() },
  });
  // 2. check if the token has expired or not
  if (!user) {
    return next(
      new AppError("Your token has been expired, please try again.", 400)
    );
  }
  // 3. Finally updated the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  // now send the jwt token
  createAndSendToken(user, 200, req, res);
});

// Update user current password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get the user based on its id
  const user = await User.findById(req.user._id).select("+password");

  // 2. Verify current password of user
  if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError("Your current password do not match, please try again.", 401)
    );
  }

  // 3. If all good then update the password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4. log user in and send jwt
  createAndSendToken(user, 201, req, res);
});
