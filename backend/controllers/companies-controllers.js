const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require('../models/http-error');

const pool = require('../models/postgresDB').pool

const DUMMY_USERS = []

const getCompanies = async (req,res,next) => {
    let allCompanies;
    try {
        allCompanies = await pool.query('SELECT * FROM companies');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find places. ', 
            500
        );
        return next(error);
    }

    if (!allCompanies.rows){
        const error = new HttpError(
            'Could not find any company', 
            404
        );
        return next(error);
    }

    res.json(allCompanies.rows);
}

const getCompanyById = async (req, res, next) => {
  const CompanyId = req.params.cid;
  
  let singleCompany;
  try {
    singleCompany = await pool.query('SELECT * FROM companies WHERE company_id = $1', [CompanyId]);
} catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find places. ', 
        500
    );
    return next(error);
}

if (!singleCompany.rows){
    const error = new HttpError(
        'Could not find any company', 
        404
    );
    return next(error);
}

res.json(singleCompany.rows);
};

const createCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
    const { name, email, password, image} = req.body;

    let newCompany;
  
    try {
      newCompany = await pool.query('SELECT email FROM companies WHERE email LIKE $1',[email]);
    } catch (err) {
      console.log(err)
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
      const error = new HttpError("Could not create company, please try again", 500);
      console.log(password);

      return next(error);
    }

    let createdCompany;

    try {
      createdCompany = await pool.query('INSERT INTO companies (name, email, password, image) \
      VALUES($1, $2, $3, $4) RETURNING company_id',
      [name, email, hashedPassword, image]);
    } catch (err) {
      console.log(err);
      const error = new HttpError("Signing up failed, please try again.", 500);
      return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: createdCompany.rows[0].company_id, email: email, type: "company" },
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
    existingCompany = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
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
    isValidPassword = await bcrypt.compare(password, existingCompany.rows[0].password);
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
      { userId: existingCompany.rows[0].company_id, email: email, type: "company" },
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
    type: "company"
  });
};

const updateCompany = async (req,res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { nif,name,email,address,phone,city,nJobs, image } = req.body;
  const companyId = req.params.cid;

  let updatedCompany;
  try {
    updatedCompany = await pool.query('SELECT * FROM companies WHERE company_id = $1', [companyId]);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find the company. ', 500
    );
    return next(error);
  }

  try {
    updatedCompany = await pool.query('UPDATE companies \
    SET phone_number = $1, address = $2 \
    WHERE company_id = $3',
    [phone, address, companyId]);
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.json("Company " + companyId + " updated");
  
};

const deleteCompany = async (req,res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const companyId = req.params.cid;
  let deletedCompany;

  

  try {
    deletedCompany = await pool.query('DELETE FROM companies WHERE company_id = $1', [companyId]);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
        'Something went wrong, could not find the company. ', 500
    );
    return next(error);
  }

  console.log(deletedCompany);


  if (!deletedCompany.rows){
    const error = new HttpError(
        'Could not find a company for the provided id', 
        404
    );
    return next(error);
  }


  res.status(200).json({message: 'Deleted company'});
};

exports.getCompanies = getCompanies;
exports.createCompany = createCompany;
exports.loginCompany = loginCompany;
exports.getCompanyById = getCompanyById;
exports.updateCompany = updateCompany;
exports.deleteCompany = deleteCompany;