const express = require("express");
const { check } = require("express-validator");

const newsletterControllers = require("../controllers/newsletter-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", newsletterControllers.getNewsletterEmails);

// Requests têm de ter Token
//router.use(checkAuth);

router.post(
  "/apply",
  [
    check("email").isEmail(),
  ],
  newsletterControllers.applyNewsletter
);


module.exports = router;