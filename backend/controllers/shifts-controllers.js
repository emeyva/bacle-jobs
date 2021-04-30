const { validationResult, query } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../utils/http-error");
const pool = require("../db-connect/postgresDB").pool;
const getCoordsForAddress = require("../utils/location");

const getShifts = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await pool.query("SELECT * FROM shifts");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the user. ",
      500
    );
    return next(error);
  }

  res.json({ allShifts: existingUser.rows });
};

const createShift = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check you data", 422)
    );
  }

  const {
    extra_job_id,
    date,
    init_time,
    finish_time,
    description,
    salary,
  } = req.body;
  const creationDate = new Date().toISOString();
  let existingExtraJob;

  try {
    existingExtraJob = await pool.query(
      "SELECT * from extra_jobs \
      WHERE id = $1",
      [extra_job_id]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the extra job. ",
      500
    );
    return next(error);
  }

  if (!existingExtraJob.rows[0]) {
    const error = new HttpError(
      "Could not find a extra job for the provided id",
      404
    );
    return next(error);
  }

  (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertShiftQuery =
        "INSERT INTO shifts \
        (extra_job_id, date, init_time, finish_time, created_date, description, salary) \
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id";
      const shiftObject = await client.query(insertShiftQuery, [
        extra_job_id,
        date,
        init_time,
        finish_time,
        creationDate,
        description,
        salary,
      ]);

      let salaryMin, salaryMax;
      const salaryRange = existingExtraJob.rows[0].salary_range;
      if (salaryRange[0] == null && salaryRange[1] == null) {
        salaryMin = salary;
        salaryMax = salary;
      } else {
        if (salary < salaryRange[0]) {
          salaryMin = salary;
          salaryMax = salaryRange[1];
        }
        if (salary > salaryRange[1]) {
          salaryMax = salary;
          salaryMin = salaryRange[0];
        }
      }

      const newSalaryRange = [salaryMin, salaryMax];
      console.log("salaryMin: " + salaryMin + " salaryMax: " + salaryMax);
      if (salaryMin && salaryMax) {
        const updateExtraJobSalaryRange =
          "UPDATE extra_jobs SET salary_range = $1 WHERE id = $2";
        const extraJobObject = await client.query(updateExtraJobSalaryRange, [
          newSalaryRange,
          extra_job_id,
        ]);
      }

      res.status(201).json({
        statusMessage: "Shift created successfully!",
        shiftId: shiftObject.rows[0].id,
      });

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      console.log(e);
      const error = new HttpError(
        "Creating shift failed, please try again.",
        500
      );
      return next(error);
    } finally {
      client.release();
    }
  })().catch((e) => console.log(e));
};

const getShiftsByExtraJobId = async (req, res, next) => {
  const extraJobId = req.params.eid;
  let existingExtraJob;

  try {
    existingExtraJob = await pool.query(
      "SELECT * from extra_jobs \
      WHERE id = $1",
      [extraJobId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the extra job. ",
      500
    );
    return next(error);
  }

  if (!existingExtraJob.rows[0]) {
    const error = new HttpError(
      "Could not find a extra job for the provided id",
      404
    );
    return next(error);
  }

  let shiftsFromExtraJob;
  try {
    shiftsFromExtraJob = await pool.query(
      "SELECT * FROM shifts \
      WHERE extra_job_id = $1",
      [extraJobId]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Getting shifts fom extraJob failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    statusMessage: "Shifts from Extra Job pulled successfully!",
    shifts: shiftsFromExtraJob.rows,
  });
};

const deleteShift = async (req, res, next) => {
  const shiftId = req.params.sid;

  let existingShift;

  try {
    existingShift = await pool.query(
      "SELECT * from shifts \
      WHERE id = $1",
      [shiftId]
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the shift",
      500
    );
    return next(error);
  }

  if (!existingShift.rows[0]) {
    const error = new HttpError(
      "Could not find a shift for the provided id",
      404
    );
    return next(error);
  }

  let deletedShift;

  try {
    deletedShift = await pool.query("DELETE FROM shifts \
    WHERE id = $1", [
      shiftId,
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find the shift. ",
      500
    );
    return next(error);
  }

  res.status(201).json({
    statusMessage: "Shift deleted successfully!",
    deletedShiftId: shiftId,
  });
};

exports.getShifts = getShifts;
exports.createShift = createShift;
exports.getShiftsByExtraJobId = getShiftsByExtraJobId;
exports.deleteShift = deleteShift;
