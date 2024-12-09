const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");
const {isloggedIn,isReviewAuthor} = require("../middleware.js");
const ReviewControler=require("../Controller/reviews.js");

// POST / - Add a new review to a listing
router.post(
    "/",isloggedIn,
    wrapAsync(ReviewControler.Addreview)
);

// DELETE /:reviewId - Delete a review from a listing
router.delete(
    "/:reviewId",isloggedIn,isReviewAuthor,
    wrapAsync(ReviewControler.reviewDestroy)
);

module.exports = router;
