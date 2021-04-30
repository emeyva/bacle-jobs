const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const getCoordsForAddress = require("../utils/location");

const pool = require("../db-connect/postgresDB").pool;

const DUMMY_USERS = [];

const getCompanies = async (req, res, next) => {
  let allCompanies;
  try {
    allCompanies = await pool.query("SELECT * FROM companies");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find places. ",
      500
    );
    return next(error);
  }

  if (!allCompanies.rows) {
    const error = new HttpError("Could not find any company", 404);
    return next(error);
  }

  res.json(allCompanies.rows);
};

const getCompanyById = async (req, res, next) => {
  const CompanyId = req.params.cid;

  let singleCompany;
  try {
    singleCompany = await pool.query(
      "SELECT * FROM companies WHERE company_id = $1",
      [CompanyId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find places. ",
      500
    );
    return next(error);
  }

  if (!singleCompany.rows[0]) {
    const error = new HttpError("Could not find any company", 404);
    return next(error);
  }

  res.json(singleCompany.rows);
};

const createCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const { name, email, password, image } = req.body;

  let newCompany;
  const createdDate = new Date().toISOString();

  try {
    newCompany = await pool.query(
      "SELECT email FROM companies WHERE email LIKE $1",
      [email]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log("Existing user " + newCompany.rows[0]);
  console.log("Email  " + email);

  if (newCompany.rows[0]) {
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
    const error = new HttpError(
      "Could not create company, please try again",
      500
    );
    console.log(password);

    return next(error);
  }

  let createdCompany;

  try {
    createdCompany = await pool.query(
      "INSERT INTO companies (name, email, password, image, created_date) \
      VALUES($1, $2, $3, $4, $5) RETURNING company_id",
      [name, email, hashedPassword, image, createdDate]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdCompany.rows[0].company_id,
        email: email,
        type: "company",
      },
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
    userId: createdCompany.rows[0].company_id,
    email: email,
    token: token,
    type: "company",
  });
};

const loginCompany = async (req, res, next) => {
  const { email, password } = req.body;

  let existingCompany;

  try {
    existingCompany = await pool.query(
      "SELECT * FROM companies WHERE email = $1",
      [email]
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingCompany) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      existingCompany.rows[0].password
    );
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
      {
        userId: existingCompany.rows[0].company_id,
        email: email,
        type: "company",
      },
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
    userId: existingCompany.rows[0].company_id,
    email: email,
    token: token,
    type: "company",
  });
};

const updateCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { name, phone_number, address, image, about_me } = req.body;

  const companyId = req.params.cid;
  let country;
  let countryCode;
  let city;
  let locality;
  let coordinate_long;
  let coordinate_lat;
  let data;
  const changedDate = new Date().toISOString();
  let updatedCompany;

  try {
    updatedCompany = await pool.query(
      "SELECT * FROM companies WHERE company_id = $1",
      [companyId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the company. ",
      500
    );
    return next(error);
  }
  if (!updatedCompany.rows[0]) {
    const error = new HttpError(
      "Could not find a company for the provided id",
      404
    );
    return next(error);
  }

  if (name == null) {
    name = updatedCompany.rows[0].name;
  }
  if (phone_number == null) {
    phone_number = updatedCompany.rows[0].phone_number;
  }
  if (address == null) {
    address = updatedCompany.rows[0].address;
  }
  if (image == null) {
    image = updatedCompany.rows[0].image;
  }
  if (about_me == null) {
    about_me = updatedCompany.rows[0].about_me;
  }

  if (address) {
    try {
      data = await getCoordsForAddress(address);
      coordinates = data[0];
      city = data[1];
      coordinate_long = coordinates.lng;
      coordinate_lat = coordinates.lat;
      locality = data[2];
      country = data[3];
      countryCode = data[4];
    } catch (error) {
      return next(error);
    }
  }

  try {
    updatedCompany = await pool.query(
      "UPDATE companies \
    SET name = $1, phone_number = $2, address = $3, coordinate_long = $4, coordinate_lat = $5,\
    city = $6, locality = $7, country = $8, country_code = $9, about_me = $10, image = $11\
    WHERE company_id = $12",
      [
        name,
        phone_number,
        address,
        coordinate_long,
        coordinate_lat,
        city,
        locality,
        country,
        countryCode,
        about_me,
        image,
        companyId,
      ]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Updating company failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    statusMessage: "Updated company successfully!",
    companyId: companyId,
  });
};

const deleteCompany = async (req, res, next) => {
  const companyId = req.params.cid;
  let existingCompany;

  try {
    existingCompany = await pool.query(
      "SELECT * FROM companies WHERE company_id = $1",
      [companyId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find places. ",
      500
    );
    return next(error);
  }

  if (!existingCompany.rows[0]) {
    const error = new HttpError("Could not find any company with that Id", 404);
    return next(error);
  }

  let deletedCompany;

  try {
    deletedCompany = await pool.query(
      "DELETE FROM companies WHERE company_id = $1",
      [companyId]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the company. ",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Company deleted successfully!",
    deletedCompanyId: companyId,
  });
};

exports.getCompanies = getCompanies;
exports.createCompany = createCompany;
exports.loginCompany = loginCompany;
exports.getCompanyById = getCompanyById;
exports.updateCompany = updateCompany;
exports.deleteCompany = deleteCompany;
