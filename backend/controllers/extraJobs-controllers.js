const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const { pool } = require('../models/postgresDB');

const getExtraJobs = async (req,res,next) => {
    let allExtraJobs;
    
    if (Object.keys(req.query).length === 0){
        console.log("empty");
        console.log(req.query);
        try {
            allExtraJobs = await pool.query('SELECT * FROM extra_jobs');
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find extra jobs. ', 500
            );
            return next(error);
        }
    
        if (!allExtraJobs.rows){
            const error = new HttpError(
                'Could not find any extra job', 
                404
            );
            return next(error);
        }
    
        res.json(allExtraJobs.rows);
    }else{
        console.log("not empty");
        console.log(req.query);
        console.log(req.query.type);
        console.log(req.query.city);
        let type = req.query.type
        let city = req.query.city
        let salaryMin;

        if(!type){
            type='%%'
        }
        if(!city){
            city='%%'
        }

        if(req.query.salaryMin !== undefined){
            console.log(req.query.salaryMin);
            salaryMin = req.query['salaryMin'];
            req.query['salaryMin']=null;
            console.log(req.query);
        }
        try {
            allExtraJobs = await pool.query('SELECT * FROM extra_jobs WHERE type LIKE $1 AND address LIKE $2', [type, city]);
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find extra jobs. ', 500
            );
            return next(error);
        }
    
        if (!allExtraJobs){
            const error = new HttpError(
                'Could not find any extra job', 
                404
            );
            return next(error);
        }
        
        if (salaryMin){
            for (var index = allJobs.length; index--;) {
                if (allExtraJobs[index].salary < salaryMin) {
                    allExtraJobs.splice(index,1);
                }
            }
        }
        res.json(allExtraJobs.rows);
    }
    
}

const getExtraJobByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    
    let extraJobs;
    try {
        extraJobs = await pool.query('SELECT DISTINCT extra_jobs.title, extra_jobs.description, extra_jobs.company_id, extra_jobs.job_id, extra_jobs.salary, extra_jobs.address \
        FROM extra_jobs \
        INNER JOIN extra_job_applications ON extra_job_applications.user_id = $1', [userId]);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a extra job. ', 500
        );
        return next(error);
    }

    if (!extraJobs.rows){
        const error = new HttpError(
            'Could not find a extra job for the provided id', 
            404
        );
        return next(error);
    }

    res.json(extraJobs.rows);
};

const getExtraJobByCompanyId = async (req, res, next) => {
    const companyId = req.params.cid;
    
    let extraJobs;
    try {
        extraJobs = await pool.query('SELECT * \
        FROM extra_jobs \
        WHERE company_id = $1', [companyId]);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a extra job. ', 500
        );
        return next(error);
    }

    if (!extraJobs.rows){
        const error = new HttpError(
            'Could not find a extra job for the provided id', 
            404
        );
        return next(error);
    }

    res.json(extraJobs.rows);
};

const getExtraJobById = async (req, res, next) => {
    const extraJobId = req.params.pid;
    
    let extraJob;
    try {
        extraJob = await pool.query('SELECT * \
        FROM extra_jobs \
        WHERE id = $1', [extraJobId]);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a extra job. ', 500
        );
        return next(error);
    }

    if (!extraJob){
        const error = new HttpError(
            'Could not find a extra job for the provided id', 
            404
        );
        return next(error);
    }

    res.json(extraJob.rows);
};

const createExtraJob = async (req,res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passed, please check you data', 422));
    }
    const { company_id, title, description, address, salary, category, date} = req.body;
    const creationDate = new Date().toISOString();

    let coordinates;
    let city_var;
    try {
        data = await getCoordsForAddress(address);
        coordinates=data[0];
        city_var=data[1];
    } catch (error) {
        return next(error);
    }
    
    console.log(coordinates)
    const coordinate_long = coordinates.lng
    const coordinate_let = coordinates.lat

    let updatedCompany;
    try {
        updatedCompany = await pool.query('SELECT * from companies \
        WHERE company_id = $1', [company_id]);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the company. ', 500
        );
        return next(error);
    }

    const companyName = updatedCompany.rows[0].name;
    const companyImage = updatedCompany.rows[0].image;

    let createdExtraJob;

    try {
        createdExtraJob = await pool.query('INSERT INTO extra_jobs \
        (company_id, title, description, salary, category, address, city, coordinate_long, coordinate_let, date, timestamp, company_name, image) \
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
        [company_id, title, description, salary, category, address, city_var, coordinate_long, coordinate_let, date, creationDate, companyName, companyImage]);
      } catch (err) {
        console.log(err);
        const error = new HttpError("Creating extra job failed, please try again.", 500);
        return next(error);
      }
    

    res.status(201).json({extraJob: createdExtraJob.rows});
};

const updateExtraJob = async (req,res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    
    let { title, description, address, salary, category, date, city} = req.body;
    const extraJobId = req.params.jid;

    const changedDate = new Date().toISOString();

    let updatedExtraJob;
    try {
        updatedExtraJob = await pool.query('SELECT * \
        FROM extra_jobs \
        WHERE id = $1', [extraJobId]);
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not find the job. ', 500
        );
        return next(error);
    }

    let coordinates;
    let city_var;
    let coordinate_long;
    let coordinate_let;
    if(title       == null){title       = updatedExtraJob.rows[0].title      }
    if(description == null){description = updatedExtraJob.rows[0].description}
    if(address     == null){address     = updatedExtraJob.rows[0].address    }
    if(salary      == null){salary      = updatedExtraJob.rows[0].salary     }
    if(category    == null){category    = updatedExtraJob.rows[0].category   }
    if(date        == null){date        = updatedExtraJob.rows[0].date       }
    if(city        == null){city        = updatedExtraJob.rows[0].city       }

    if(address){
        try {
            data = await getCoordsForAddress(address);
            coordinates=data[0];
            city_var=data[1];
            coordinate_long = coordinates.lng
            coordinate_let = coordinates.lat
        } catch (error) {
            return next(error);
        }
    }

    

    try {
        newExtraJob = await pool.query('UPDATE extra_jobs \
        SET title = $1, description = $2, address = $3, city = $4,\
        salary = $5, coordinate_long = $6, coordinate_let = $7, change_timestamp = $8 \
        WHERE id = $9',
        [title, description, address, city_var, salary, coordinate_long, coordinate_let, changedDate, extraJobId]);
    } catch (err) {
        console.log(err)
        const error = new HttpError(
        'Updating Job failed, please try again.',
        500
        );
        console.log(err);
        return next(error);
    }

    

    res.status(200).json({job: newExtraJob.rows[0]});
    
};

const deleteExtraJob = async (req,res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const extraJobId = req.params.jid;
    let deletedExtraJob;

    try {
        existingExtraJob = await pool.query('SELECT * FROM extra_jobs WHERE id = $1',
        [extraJobId]);
      } catch (err) {
        console.log(err);
        const error = new HttpError("Could not find extra job.", 500);
        return next(error);
    }

    if (!existingExtraJob.rows[0]){
        const error = new HttpError(
            'Could not find a extra job for the provided id', 
            404
        );
        return next(error);
    }

    try {
        deletedExtraJob = await pool.query('DELETE FROM extra_jobs \
        WHERE id = $1',
        [extraJobId]);
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not find the extra job. ', 500
        );
        return next(error);
    }

    res.status(200).json({deleteExtraJob: 'Deleted job'});
};
exports.getExtraJobById = getExtraJobById;
exports.createExtraJob = createExtraJob;
exports.updateExtraJob = updateExtraJob;
exports.deleteExtraJob = deleteExtraJob;
exports.getExtraJobs = getExtraJobs;
exports.getExtraJobByUserId = getExtraJobByUserId;
exports.getExtraJobByCompanyId = getExtraJobByCompanyId;