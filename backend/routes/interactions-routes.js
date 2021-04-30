const express = require("express");
const { check } = require("express-validator");

const interactionsControllers = require("../controllers/interactions-controllers");

const router = express.Router();

router.post(
  "/apply",
  [check("user_id").not().isEmpty(), check("extra_shift_id").not().isEmpty()],
  interactionsControllers.applyShift
);

router.delete(
  "/unapply",
  [check("user_id").not().isEmpty(), check("extra_shift_id").not().isEmpty()],
  interactionsControllers.cancelApplyJob
);

module.exports = router;

//check('phone').isLength({ min: 9,max:9})
