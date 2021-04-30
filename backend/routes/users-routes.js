const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Requests sem ter Token
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 8 })],
  usersControllers.login
);

router.get("/:uid", usersControllers.getUserById);
router.get("/experience/:uid", usersControllers.getExperienceByUserId);
router.get("/", usersControllers.getUsers);

// Requests têm de ter Token
router.use(checkAuth);

router.post("/experience/:uid", usersControllers.createExperienceByUserId);

router.patch(
  "/:uid",
  [
    check("phone").isInt().isLength({ min: 9, max: 9 }).optional(),
    check("birthDate").not().isEmpty().optional(),
    check("about_me").not().isEmpty().optional(),
    check("address").not().isEmpty().optional(),
    check("image").not().isEmpty().optional(),
  ],
  usersControllers.updateUser
);

router.delete("/:uid", usersControllers.deleteUser);

module.exports = router;

//check('phone').isLength({ min: 9,max:9})
