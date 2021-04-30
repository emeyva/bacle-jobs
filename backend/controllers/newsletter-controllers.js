const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;
const getCoordsForAddress = require("../utils/location");

const getUserNewsletter = async (req, res, next) => {
  await pool.query("SELECT * FROM users_newsletter", (error, results) => {
    if (error) {
      const error = new HttpError(
        "List all users failed, please try again later.",
        500
      );
    }
    res.status(200).json({ newsletter: results.rows });
  });
};

const getCompanyNewsletter = async (req, res, next) => {
  await pool.query("SELECT * FROM companies_newsletter", (error, results) => {
    if (error) {
      const error = new HttpError(
        "List all companies failed, please try again later.",
        500
      );
    }
    res.status(200).json({ newsletter: results.rows });
  });
};

const createUserNewsletter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const { email, city } = req.body;

  const timestamp = new Date().toISOString();
  let existingUser;

  try {
    existingUser = await pool.query(
      "SELECT email FROM users_newsletter WHERE email LIKE $1",
      [email]
    );
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
    createdUser = await pool.query(
      "INSERT INTO users_newsletter (email, city, timestamp) VALUES($1, $2, $3) RETURNING id",
      [email, city, timestamp]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Error enrolling your email on our newsletter",
      500
    );
    return next(error);
  }

  res.json({ statusMessage: "Enrolled successfully!" });
};

const createCompanyNewsletter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const { email, city } = req.body;

  const timestamp = new Date().toISOString();
  let existingCompany;

  try {
    existingCompany = await pool.query(
      "SELECT email FROM companies_newsletter WHERE email LIKE $1",
      [email]
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up to newsletter failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingCompany.rows[0]) {
    const error = new HttpError(
      "You are already enrolled in our newsletter.",
      422
    );
    return next(error);
  }

  let createdCompany;

  try {
    createdCompany = await pool.query(
      "INSERT INTO companies_newsletter (email, city, timestamp) VALUES($1, $2, $3) RETURNING id",
      [email, city, timestamp]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Error enrolling your email on our newsletter",
      500
    );
    return next(error);
  }

  res.json({ statusMessage: "Enrolled successfully!" });
};

exports.getUserNewsletter = getUserNewsletter;
exports.getCompanyNewsletter = getCompanyNewsletter;
exports.createUserNewsletter = createUserNewsletter;
exports.createCompanyNewsletter = createCompanyNewsletter;
