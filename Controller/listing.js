const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listing/index.ejs", { alllistings });
};

module.exports.beach = async (req, res) => {
    const alllistings = await Listing.find({category:"Beach"});
    res.render("filter/beach.ejs", { alllistings });
};

module.exports.farming = async (req, res) => {
    const alllistings = await Listing.find({category:"farming"});
    res.render("filter/farming.ejs", { alllistings });
};

module.exports.mountain = async (req, res) => {
    const alllistings = await Listing.find({category:"Mountain"});
    res.render("filter/mountain.ejs", { alllistings });
};

module.exports.forest= async (req, res) => {
    const alllistings = await Listing.find({category:"forest"});
    res.render("filter/forest.ejs", { alllistings });
};

module.exports.rain= async (req, res) => {
    const alllistings = await Listing.find({category:"rain"});
    res.render("filter/rain.ejs", { alllistings });
};

module.exports.ship= async (req, res) => {
    const alllistings = await Listing.find({category:"ship"});
    res.render("filter/ship.ejs", { alllistings });
};

module.exports.sun= async (req, res) => {
    const alllistings = await Listing.find({category:"sun"});
    res.render("filter/sun.ejs", { alllistings });
};

module.exports.renderCreateform = (req, res) => {
    res.render("listing/create.ejs");
};

module.exports.renderShow = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");

    res.render('listing/show.ejs', { listings });
};

module.exports.Createfunction = async (req, res, next) => {
  let response=  await geocodingClient.forwardgeocode({
        query: req.body.Listing.location,
        limit:2,
    })
    .send()
    try {
        // Ensure the user is logged in
        if (!req.user) {
            req.flash("error", "You must be logged in to create a listing.");
            return res.redirect("/login");
        }

        // Validate the incoming data
        const Url = req.file.path;
        const filename = req.file.filename;
        const { listing } = req.body;
        

        // Create the new listing
        const newListing = new Listing(listing);
        newListing.owner = req.user._id;
        newListing.image = {Url,filename};
        newListing.geometry = response.body.features[0].geometry;
        // Save the listing to the database
        await newListing.save();

        // Send success message and redirect to listings page
        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    } catch (error) {
        console.log(error);
        // Handle errors and send a user-friendly error message
        req.flash("error", "An error occurred while creating the listing.");
        res.redirect("/new-listing");
    }
};

module.exports.renderEditform = async (req, res) => {
    let {id}=req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("listings")
    }
    let originalImageUrl = listings.image.Url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listing/edit.ejs",{ listings , originalImageUrl });
};



module.exports.editfunction = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
        let Url = req.file.path;
        let filename = req.file.filename;
        listing.image = {Url,filename};
        console.log(listing.image);
        await listing.save();
    }
    req.flash("success", " Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};