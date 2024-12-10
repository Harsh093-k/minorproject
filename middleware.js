const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema , reviewSchema } = require("./schema.js"); 
const expressError = require("./utils/ExpressError.js"); 

module.exports.isloggedIn=(req ,res ,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req ,res ,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req ,res ,next) => {
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner[0].equals(res.locals.curruser._id)) {
        req.flash("error","you don't have permission edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req ,res ,next) => {
    let {id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)) {
        req.flash("error","you don't have permission to delete any other reviews ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware for validating reviews
module.exports.validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new expressError(400, "Invalid Review Data");
    }
    let { error } = reviewSchema.validate(req.body.review);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

// middleware for validating listing
module.exports.validateListing = (req , res , next) => {
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};



