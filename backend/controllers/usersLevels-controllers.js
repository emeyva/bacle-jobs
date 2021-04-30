const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;
const getCoordsForAddress = require("../utils/location");

const getUserLevelByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  let existingUser;
  try {
    existingUser = await pool.query(
      "SELECT * FROM users_account WHERE user_id = $1",
      [UserId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  if (!existingUser.rows) {
    const error = new HttpError(
      "Could not find a user for the provided id",
      404
    );
    return next(error);
  }

  let existingUserLevel;
  try {
    existingUserLevel = await pool.query(
      "SELECT * FROM users_level WHERE user_id = $1",
      [UserId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user level. ",
      500
    );
    return next(error);
  }

  res.json({ userLevel: existingUserLevel.rows });
};

exports.getUserLevelByUserId = getUserLevelByUserId;
