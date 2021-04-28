const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const pool = require('../models/postgresDB').pool
const getCoordsForAddress = require("../utils/location");

const getNewsletterEmails = async (req, res, next) => {
  await pool.query('SELECT * FROM newsletter', (error, results) => {
    if (error) {
      const error = new HttpError(
        "List all usersaccount failed, please try again later.",
        500
      );
    }
    res.status(200).json(results.rows)
  })
};

const applyNewsletter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const {
    email
  } = req.body;

  const timestamp = new Date().toISOString();
  let existingUser;
  
  try {
    existingUser = await pool.query('SELECT email FROM newsletter WHERE email LIKE $1',[email]);
  } catch (err) {
    const error = new HttpError(
      "Signing up to newsletter failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser.rows[0]) {
    const error = new HttpError(
      "You are already enrolled in our newsletter.",
      422
    );
    return next(error);
  }

  let createdUser;

  try {
    createdUser = await pool.query('INSERT INTO newsletter (email, timestamp) VALUES($1, $2) RETURNING id',
    [email, timestamp]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error enrolling your email on our newsletter", 500);
    return next(error);
  }

  res.json({statusMessage: "Enrolled successfully!"});

};


exports.getNewsletterEmails = getNewsletterEmails;
exports.applyNewsletter = applyNewsletter;
