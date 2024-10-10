const joi=require('joi');
const { Employee } = require('./models/emp');


module.exports.empSchema = joi.object({
    Employee: joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),  // Consider validating email format
        mobileNo: joi.string().required(),
        designation: joi.string().required(),
        gender: joi.string().required(),
        course: joi.string().required(),
        image: joi.string().allow('', null)  // Allow empty string and null for image
    }).required()
});





