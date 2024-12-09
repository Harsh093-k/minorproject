const Listing = require("../models/listing.js")
const Review = require("../models/review.js");

module.exports.Addreview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new expressError(404, "Listing Not Found");
    }

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    // Save both documents
    await newReview.save();
    await listing.save();

    req.flash("success","new Review created!");
    // Redirect to the listing's detail page
    res.redirect(`/listings/${listing._id}`);
};

module.exports.reviewDestroy = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    req.flash("success"," Review Deleted!");
    // Redirect to the listing's detail page
    res.redirect(`/listings/${id}`);
};
 
