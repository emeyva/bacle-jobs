const express = require("express");
const { check } = require("express-validator");

const newsletterControllers = require("../controllers/newsletter-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/users", newsletterControllers.getUserNewsletter);
router.get("/companies", newsletterControllers.getCompanyNewsletter);

// Requests têm de ter Token
//router.use(checkAuth);

router.post(
  "/users",
  [check("email").isEmail(), check("city").not().isEmpty()],
  newsletterControllers.createUserNewsletter
);

router.post(
  "/companies",
  [check("email").isEmail(), check("city").not().isEmpty()],
  newsletterControllers.createCompanyNewsletter
);

module.exports = router;
