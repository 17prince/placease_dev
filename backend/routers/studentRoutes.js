const express = require("express");

const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");

const router = express.Router();

// Student SignUp
router.post("/signup", authController.signUp);

// Student Loing
router.post("/login", authController.login);

// Logout Student
router.get("/logout", authController.logout);

// Forget Password request
router.post("/forgetpassword", authController.forgetpassword);
router.patch("/resetpassword/:token", authController.resetPassword);

// All the protected routes
router.use(authController.protect);

// Get my details
router.get("/getme", studentController.getMyId, studentController.getUser);

// Update my details
router.patch("/updateme", studentController.updateMe);

router.delete("/deleteme", studentController.deleteMe);

// -------------------------------PROJECTS-----------------------------
router
  .route("/projects")
  .post(studentController.createMyProject)
  .get(studentController.getAllMyProject);
router
  .route("/projects/:id")
  .patch(studentController.updatemyProject)
  .delete(studentController.deleteMyProject);
// -------------------------------PROJECT END--------------------------------

// ----------------------------------COMPANIES--------------------------------
router
  .route("/experience")
  .post(studentController.createMyExperience)
  .get(studentController.getAllMyExperiences);
router
  .route("/experience/:id")
  .patch(studentController.updatemyExperience)
  .delete(studentController.deleteMyExperience);

  // --------------------------------COMPANIES END--------------------------

router.use(authController.restrictExecpt("Placement_Cell", "Department"));

// Handling all the students by placement coordiantor and palcement deparment

// Get all the student details
router.get("/showallstudents", studentController.getAllStudents);

router
  .route("/managestudents")
  .get(studentController.getOneStudent)
  .post(studentController.createOne)
  .patch(studentController.updateOne)
  .delete(studentController.deleteOne);

// Get details of single student
router.get("/getstudent", studentController.getOneStudent);

module.exports = router;
