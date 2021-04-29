const express = require("express");
const { check } = require("express-validator");

const usersStatusControllers = require("../controllers/usersStatus-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:uid", usersStatusControllers.getUserStatusByUserId);

module.exports = router;

//check('phone').isLength({ min: 9,max:9})
