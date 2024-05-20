const express = require("express");

const authController = require("../controllers/authController");
const inboxController = require("../controllers/inboxController");

const router = express.Router();

// Autherization
router.use(authController.protect);

router.get("/", inboxController.checkTokenExist);

router.get("/oauth-url", inboxController.generateOAuthUrl);

router.get("/oauth/callback", inboxController.oauthCallback);

router.get("/fetch-emails", inboxController.fetchEmails);

module.exports = router;
