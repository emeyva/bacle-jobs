const express = require('express');
const { check } = require('express-validator');

const extraJobsControllers = require('../controllers/extraJobs-controllers');

const router = express.Router();

router.get('/:pid', extraJobsControllers.getExtraJobById);

router.get('/users/:uid', extraJobsControllers.getExtraJobByUserId);

router.get('/companies/:cid', extraJobsControllers.getExtraJobByCompanyId);

router.get('/', extraJobsControllers.getExtraJobs);

router.post(
    '/',
    [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty(),
    check('salary').not().isEmpty(),
    check('company_id').not().isEmpty(),
    ],
    extraJobsControllers.createExtraJob);

router.patch(
    '/:jid', 
    [
    check('title').not().isEmpty().optional()
    ],
    extraJobsControllers.updateExtraJob
);

router.delete('/:jid', extraJobsControllers.deleteExtraJob);

module.exports = router;