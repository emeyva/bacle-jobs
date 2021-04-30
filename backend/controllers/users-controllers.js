const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;
const getCoordsForAddress = require("../utils/location");

const getUsers = async (req, res, next) => {
  await pool.query("SELECT * FROM users_account", (error, results) => {
    if (error) {
      const error = new HttpError(
        "List all users_account failed, please try again later.",
        500
      );
    }
    res.status(200).json(results.rows);
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //const {phone,birthDate,aboutMe,experience,status,nJobs,nApplications,pendingJobs} = "null";
  const { name, email, password } = req.body;

  let existingUser;
  let user_id;
  let user_level_id;
  let user_status_id;
  const createdDate = new Date().toISOString();

  try {
    existingUser = await pool.query(
      "SELECT email FROM users_account WHERE email LIKE $1",
      [email]
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

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

  (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertUserQuery =
        "INSERT INTO users_account (name, email, password, created_date) VALUES($1, $2, $3, $4) RETURNING user_id";
      const userObject = await client.query(insertUserQuery, [
        name,
        email,
        hashedPassword,
        createdDate,
      ]);
      user_id = userObject.rows[0].user_id;
      console.log("userObject: " + userObject.rows[0].user_id);
      const insertUserLevelQuery =
        "INSERT INTO users_level (user_id, level, created_date) VALUES($1, $2, $3) RETURNING id";
      const insertUserStatusQuery =
        "INSERT INTO users_status (user_id, status, created_date) VALUES($1, $2, $3) RETURNING id";
      const userLevelObject = await client.query(insertUserLevelQuery, [
        user_id,
        1,
        createdDate,
      ]);
      const userStatusObject = await client.query(insertUserStatusQuery, [
        user_id,
        1,
        createdDate,
      ]);
      user_level_id = userLevelObject.rows[0].id;
      user_status_id = userStatusObject.rows[0].id;

      let token;
      try {
        token = jwt.sign(
          { userId: user_id, email: email, type: "user" },
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
        userId: user_id,
        email: email,
        token: token,
        type: "user",
        userLevelId: user_level_id,
        userStatusId: user_status_id,
      });

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      const error = new HttpError(
        "Could not create user, please try again",
        500
      );
      console.log(e);
      return next(error);
    } finally {
      client.release();
    }
  })().catch((e) => console.log(e));
};

const getUserById = async (req, res, next) => {
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

  console.log(existingUser.rows[0]);

  res.json({ user: existingUser.rows });
};

const getExperienceByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  let user;
  try {
    user = await pool.query(
      "SELECT * FROM users_experience WHERE user_id = $1",
      [UserId]
    );
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

  res.json({ experience: user.rows });
};

const createExperienceByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  const { experience } = req.body;

  console.log("Experience: " + experience);

  try {
    await pool.query("DELETE FROM users_experience WHERE user_id = $1;", [
      UserId,
    ]);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not clean old experience. ",
      500
    );
    return next(error);
  }

  Promise.all(
    experience.map(async (value) => {
      console.log("Value: " + value.user_experience_description);
      await pool.query(
        "INSERT INTO\
      users_experience(user_id, user_experience_description, job_category) \
      VALUES ($1, $2, $3)",
        [UserId, value.user_experience_description, value.job_category]
      );
    })
  ).then(res.status(200).json({ message: "Experience added" }));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  console.log(email);
  try {
    existingUser = await pool.query(
      "SELECT * FROM users_account WHERE email LIKE $1",
      [email]
    );
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
    type: "user",
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const UserIdFromToken = req.userData.userId;
  const userId = req.params.uid;
  if (userId != UserIdFromToken) {
    return next(
      new HttpError("Invalid credentials, please check your credentials", 422)
    );
  }

  let {
    name,
    phone_number,
    about_me,
    address,
    image,
    driving_license,
    birth_date,
  } = req.body;

  let country;
  let countryCode;
  let city;
  let locality;
  let coordinate_long;
  let coordinate_lat;

  let data;
  const changedDate = new Date().toISOString();

  let updatedUser;

  try {
    updatedUser = await pool.query(
      "SELECT * FROM users_account WHERE user_id = $1",
      [userId]
    );
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

  if (name == null) {
    name = updatedUser.rows[0].name;
  }
  if (phone_number == null) {
    phone_number = updatedUser.rows[0].phone_number;
  }
  if (address == null) {
    address = updatedUser.rows[0].address;
  }
  if (about_me == null) {
    about_me = updatedUser.rows[0].about_me;
  }
  if (image == null) {
    image = updatedUser.rows[0].image;
  }
  if (driving_license == null) {
    driving_license = updatedUser.rows[0].driving_license;
  }
  if (birth_date == null) {
    birth_date = updatedUser.rows[0].birth_date;
  }

  if (address) {
    try {
      data = await getCoordsForAddress(address);
      console.log(data);
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
    updatedUser = await pool.query(
      "UPDATE users_account \
    SET name = $1, phone_number = $2, address = $3, coordinate_long = $4, coordinate_lat = $5,\
    city = $6, locality = $7, country = $8, country_code = $9, about_me = $10, image = $11, \
    driving_license = $12, birth_date = $13, changed_date = $14\
    WHERE user_id = $15",
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
        driving_license,
        birth_date,
        changedDate,
        userId,
      ]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({
    statusMessage: "Updated user successfully!",
    userId: userId,
  });
};

const deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const userId = req.params.uid;

  let existingUser;
  try {
    existingUser = await pool.query(
      "SELECT * FROM users_account WHERE user_id = $1",
      [userId]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  if (!existingUser.rows[0]) {
    const error = new HttpError(
      "Could not find a user for the provided id",
      404
    );
    return next(error);
  }

  let deletedUser;

  try {
    deletedUser = await pool.query(
      "DELETE FROM users_account WHERE user_id = $1",
      [userId]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Deleted user successfully!",
    deletedUserId: userId,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.getExperienceByUserId = getExperienceByUserId;
exports.createExperienceByUserId = createExperienceByUserId;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
