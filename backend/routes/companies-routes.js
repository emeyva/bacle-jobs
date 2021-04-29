const express = require('express');
const { check } = require('express-validator');

const companiesControllers = require('../controllers/companies-controllers');

const router = express.Router();

router.get('/', companiesControllers.getCompanies);
router.get('/:cid', companiesControllers.getCompanyById);

router.post(
    '/signup', 
    [
        check("name").not().isEmpty(),
        check("email").isEmail(),
        check("password").isLength({ min: 8 }),
    ],
    companiesControllers.createCompany
);

router.post(
    '/login', 
    [
        check("email").isEmail(),
        check("password").isLength({ min: 8 }),
    ],
    companiesControllers.loginCompany
);

router.patch(
    '/:cid', 
    [
    check('name').not().isEmpty().optional(),
    check('email').normalizeEmail().isEmail().optional(),
    check('nif').isInt().isLength({ min: 8}).optional(),
    check('address').not().isEmpty().optional(),
    check('phone').isInt().isLength({ min: 8}).optional(),
    check('city').not().isEmpty().optional(),
    check('image').isLength({ min: 4}).optional()
    ],
    companiesControllers.updateCompany
);

router.delete('/:cid', companiesControllers.deleteCompany);

module.exports = router;


//check('phone').isLength({ min: 9,max:9})