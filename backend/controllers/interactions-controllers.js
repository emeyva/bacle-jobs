const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const applyJob = async (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    
    const { userId, jobId } = req.body;
    console.log(jobId);
    console.log(userId);
    let updatedJob;
    

    res.status(200).json({job: "not done"});
}

const cancelApplyJob = async (req, res, next) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
          );
      }
      
      const { userId, jobId } = req.body;
      
    res.status(200).json({job: "not done"});
  }

exports.applyJob = applyJob;
exports.cancelApplyJob = cancelApplyJob;