const express = require("express");
const { check } = require("express-validator");

const usersLevelsControllers = require("../controllers/usersLevels-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:uid", usersLevelsControllers.getUserLevelByUserId);

module.exports = router;

//check('phone').isLength({ min: 9,max:9})
