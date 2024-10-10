const ExpressError = require("./ExpressError"); // Correctly import ExpressError
const { empSchema } = require("./Schema.js");

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}


module.exports.ValidateEmployee = (req, res, next) => {
    let result = empSchema.validate(req.body); // Validate against the schema

    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(", "); // Full details of error
        return next(new ExpressError(400, errMsg)); // Pass the error to the next middleware
    } else {
        next();
    }
};

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        return res.redirect("/login");
    }

    next();

}