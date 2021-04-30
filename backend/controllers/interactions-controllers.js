const { validationResult } = require("express-validator");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;

const applyShift = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { user_id, extra_shift_id } = req.body;

  let existingUser;
  let existingShift;
  const creationDate = new Date().toISOString();

  try {
    existingUser = await pool.query(
      "SELECT * FROM users_account WHERE user_id = $1",
      [user_id]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find your user. ",
      500
    );
    return next(error);
  }

  if (!existingUser.rows[0]) {
    const error = new HttpError("Could not find any user with that Id", 404);
    return next(error);
  }

  try {
    existingShift = await pool.query("SELECT * FROM shifts WHERE id = $1", [
      extra_shift_id,
    ]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find shift. ",
      500
    );
    return next(error);
  }

  if (!existingShift.rows[0]) {
    const error = new HttpError("Could not find any shift with that Id", 404);
    return next(error);
  }

  let createdApplication;
  try {
    createdApplication = await pool.query(
      "INSERT INTO extra_job_applications (user_id, extra_shift_id, status, created_date) \
    VALUES($1, $2, $3, $4) RETURNING id",
      [user_id, extra_shift_id, "Pending", creationDate]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({
    status: "Shift application sent successfully!",
    userId: user_id,
    shiftId: extra_shift_id,
  });
};

const cancelApplyJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { user_id, extra_shift_id } = req.body;

  let existingUser;
  let existingShift;

  try {
    existingUser = await pool.query(
      "SELECT * FROM users_account WHERE user_id = $1",
      [user_id]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find your user. ",
      500
    );
    return next(error);
  }

  if (!existingUser.rows[0]) {
    const error = new HttpError("Could not find any user with that Id", 404);
    return next(error);
  }

  try {
    existingShift = await pool.query("SELECT * FROM shifts WHERE id = $1", [
      extra_shift_id,
    ]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find shift. ",
      500
    );
    return next(error);
  }

  if (!existingShift.rows[0]) {
    const error = new HttpError("Could not find any shift with that Id", 404);
    return next(error);
  }

  let deletedApplication;
  try {
    deletedApplication = await pool.query(
      "DELETE FROM extra_job_applications \
    WHERE user_id = $1 AND extra_shift_id = $2",
      [user_id, extra_shift_id]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({
    status: "Shift application deleted successfully!",
    userId: user_id,
    shiftId: extra_shift_id,
  });
};

exports.applyShift = applyShift;
exports.cancelApplyJob = cancelApplyJob;
