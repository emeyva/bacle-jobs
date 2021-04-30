const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;
const getCoordsForAddress = require("../utils/location");

const getUserStatusByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  let existingUser;
  try {
    existingUser = await pool.query(
      "SELECT * FROM usersaccount WHERE user_id = $1",
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

  let existingUserStatus;
  try {
    existingUserStatus = await pool.query(
      "SELECT * FROM users_status WHERE user_id = $1",
      [UserId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user status. ",
      500
    );
    return next(error);
  }

  res.json({ userStatus: existingUserStatus.rows });
};

exports.getUserStatusByUserId = getUserStatusByUserId;
