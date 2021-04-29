const express = require('express');
const { check } = require('express-validator');

const interactionsControllers = require('../controllers/interactions-controllers');

const router = express.Router();

router.patch(
    '/apply',
    [
    check('userId').not().isEmpty(),
    check('jobId').not().isEmpty()
    ],
    interactionsControllers.applyJob);

router.delete(
        '/apply',
        [
        check('userId').not().isEmpty(),
        check('jobId').not().isEmpty()
        ],
        interactionsControllers.cancelApplyJob);

module.exports = router;


//check('phone').isLength({ min: 9,max:9})