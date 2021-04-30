const express = require("express");
const { check } = require("express-validator");

const shiftsControllers = require("../controllers/shifts-controllers");
const { TokenExpiredError } = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", shiftsControllers.getShifts);

router.get("/extraJob/:eid", shiftsControllers.getShiftsByExtraJobId);

router.post(
  "/",
  [
    check("extra_job_id").not().isEmpty(),
    check("date").not().isEmpty(),
    check("init_time").not().isEmpty(),
    check("finish_time").not().isEmpty(),
    check("description").not().isEmpty(),
  ],
  shiftsControllers.createShift
);

router.delete("/:sid", shiftsControllers.deleteShift);

module.exports = router;
