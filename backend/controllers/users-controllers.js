const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const pool = require('../models/postgresDB').pool
const getCoordsForAddress = require("../utils/location");

const getUsers = async (req, res, next) => {
  await pool.query('SELECT * FROM usersaccount', (error, results) => {
    if (error) {
      const error = new HttpError(
        "List all usersaccount failed, please try again later.",
        500
      );
    }
    res.status(200).json(results.rows)
  })
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const {
    name,
    email,
    password
  } = req.body;

  let existingUser;
  
  try {
    existingUser = await pool.query('SELECT email FROM usersaccount WHERE email LIKE $1',[email]);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log("Existing user " + existingUser.rows[0]);
  console.log("Email  " + email);

  if (existingUser.rows[0]) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    console.log(password);

    return next(error);
  }

  let createdUser;

  try {
    createdUser = await pool.query('INSERT INTO usersaccount (name, email, password) VALUES($1, $2, $3) RETURNING user_id',
    [name, email, hashedPassword]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.rows[0].user_id, email: email, type: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  

  res.json({
    userId: createdUser.rows[0].user_id,
    email: email,
    token: token,
    type: "user",
  });

};

const getUserById = async (req, res, next) => {
  const UserId = req.params.uid;

  let existingUser;
  try {
    existingUser = await pool.query('SELECT * FROM usersaccount WHERE user_id = $1', [UserId]);
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

  console.log(existingUser.rows[0])

  res.json({user: existingUser.rows});
};

const getExperienceByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  let user;
  try {
    user = await pool.query('SELECT * FROM usersexperience WHERE user_id = $1', [UserId]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  if (!user.rows) {
    const error = new HttpError(
      "Could not find a user for the provided id",
      404
    );
    return next(error);
  }

  res.json({experience: user.rows});
};

const createExperienceByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  const {experience} = req.body;

  console.log("Experience: " + experience);

  try {
    await pool.query('DELETE FROM usersexperience WHERE user_id = $1;', [UserId]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not clean old experience. ",
      500
    );
    return next(error);
  }

  Promise.all(experience.map(async (value) => {
    console.log("Value: " + value.user_experience_description);
    await pool.query('INSERT INTO\
      usersexperience(user_id, user_experience_description, job_category) \
      VALUES ($1, $2, $3)', [UserId, value.user_experience_description, value.job_category]);
  })).then(res.status(200).json({ message: "Experience added" }));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  console.log(email);
  try {
    existingUser = await pool.query('SELECT * FROM usersaccount WHERE email LIKE $1', [email]);
    existingUser = existingUser.rows[0];
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log(existingUser);

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.user_id, email: existingUser.email, type: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.user_id,
    email: existingUser.email,
    token: token,
    type: "user"
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const {
    phone,
    birthDate,
    aboutMe,
    address,
    location,
    experience,
    status,
    nJobs,
    nApplications,
    pendingJobs,
  } = req.body;

  const userId = req.params.uid;
  let lat;
  let lng;

  let updatedUser;
  try {
    updatedUser = await pool.query('SELECT * FROM usersaccount WHERE user_id = $1', [userId]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }
  if (!updatedUser.rows[0]) {
    const error = new HttpError(
      "Could not find a user for the provided id",
      404
    );
    return next(error);
  }
  console.log("ADDRESS:" + address);
  if (address !== null && address !== undefined) {
    let coordinates;
    try {
      data = await getCoordsForAddress(address);
      updatedUser.location = data[0];
      lat = data[0].lat;
      lng = data[0].lng;
      console.log("coords:" + data[0]);
    } catch (error) {
      return next(error);
    }
  }

  try {
    updatedUser = await pool.query('UPDATE usersaccount \
    SET about_me = $1, phone_number = $2, address = $3, coordinate_long = $4, coordinate_lat = $5 \
    WHERE user_id = $6',
    [aboutMe, phone, address, lat, lng, userId]);
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json(updatedUser);
};

const deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const userId = req.params.uid;
  let deletedUser;

  try {
    deletedUser = await pool.query('DELETE FROM usersaccount WHERE user_id LIKE $1', [userId]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  console.log(deletedUser);

  if (!deletedUser.rows) {
    const error = new HttpError(
      "Could not find a user for the provided id",
      404
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted user" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.getExperienceByUserId = getExperienceByUserId;
exports.createExperienceByUserId = createExperienceByUserId
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
