const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [30, "Maximum length of name can be 30"],
    minlength: [3, "Minimum length of name should 5"],
    required: [true, "Name can not be empty"],
  },

  email: {
    type: String,
    required: [true, "Email can not be empty"],
    unique: [true, "This email is in use, please try another valid email"],
    lowercase: true,
    validate: {
      validator: function (value) {
        // Valid email address with domain of acropolis.in
        return validator.isEmail(value) && value.endsWith("@acropolis.in");
      },
      message: "Email must belong to college Email id.",
    },
  },

  password: {
    type: String,
    required: [true, "Password is must ! Please provide a password"],
    maxlength: [20, "Maximum length of password must be 20"],
    minlength: [8, "Minimum length of password must be 8"],
    select: false, // The select option allows field to populate
  },

  confirmPassword: {
    type: String,
    required: [true, "Please Confirm Your Password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password does not match please try again !",
    },
  },

  avatar: {
    type: String,
    default: "default.jpg",
  },
  phone: {
    type: String,
    validate: {
      validator: function (value) {
        // Retruns true if the mobile number is Indian
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "Mobile number does not belong to India !",
    },
  },
  dob: Date,
  address: String,

  enrollment: String,
  scholarNo: String,
  course: {
    type: String,
    enum: ["B.Tech", "B.E"],
  },
  branch: {
    type: String,
    validate: {
      validator: function (value) {
        // Define an object to map branches to valid departments
        const validDepartments = {
          "B.Tech": ["CS", "IT", "CSIT", "AIML", "ECE"], // Add more valid departments for BTECH
          // MBA: ["Finance", "Marketing", "HR"], // Add more valid departments for MBA
        };

        // Do not write a operational code inside a validator instead use return statement that always returns a boolean vlaue
        // and it you want to write operational code then use arrow function like here we used!
        return () => {
          // Check if the selected branch has a valid department
          if (
            this.course &&
            validDepartments[this.course] &&
            validDepartments[this.course].includes(value.split("-")[0])
          ) {
            return true;
          }

          return false;
        };
      },
      message: "Invalid department for the selected course.",
    },
  },
  class: String,
  batchYear: {
    type: String,
    validate: {
      validator: function (value) {
        return (
          value >= new Date().getFullYear() &&
          value <= new Date().getFullYear() + 5
        );
      },
    },
    message: "Invalid year is passed !",
  },

  currentCGPA: {
    type: Number,
    default: 0.0,
  },
  semester: String,

  role: {
    type: String,
    default: "Student",
    enum: ["Student", "Placement_Cell", "Department"],
    required: [true, "Role not found, please define your role"],
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  resetTokenExpires: Date,
  passwordResetToken: String,
});

//  If the user changes or reset there password
studentSchema.pre("save", function (next) {
  // if the password is create for the first time then dont do anything
  if (!this.isModified("password") || this.isNew) return next();

  // if Password is reset/forget
  this.createdAt = Date.now();
  // -1000 (1sec) delay is considered for request hit the server
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Encrypting the password using pre middle ware hook
studentSchema.pre("save", async function (next) {
  // if password is changed then do not directly hash the password
  if (!this.isModified("password")) return next();

  // Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  // undefined confirmPassword
  this.confirmPassword = undefined;
  next();
});

// Show only those students who have the active field true
studentSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

// MongoDb provides user defined methods or function
studentSchema.methods.checkPassword = async function (
  proivededPassword,
  savedPassword
) {
  return await bcrypt.compare(proivededPassword, savedPassword);
};

// If the user itself changes there password
studentSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

// Create Random token for verification of user, when forget password
studentSchema.methods.createPasswordResetToken = function (next) {
  // Create a random cryto bytes and endcoding it to a hexa string and send it to client
  const resetToken = crypto.randomBytes(32).toString("hex");

  // now before saving it to db convert resetToken into hash
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken);

  // set the expire time for token
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("Students", studentSchema);
