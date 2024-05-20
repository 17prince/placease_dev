const express = require("express");

const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(companyController.getAllJobDetails);

module.exports = router;
