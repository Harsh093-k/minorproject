const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing =require("../models/listing.js");
const {listingSchema}=require("../models/listing.js");
const {isloggedIn , isOwner}=require("../middleware.js");
const ListingController = require("../Controller/listing.js");
const {validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudinary.js")
const upload = multer({ storage });

// index Route
router.get("",ListingController.index);

router.get("/beach",ListingController.beach);

router.get("/forest",ListingController.forest);

router.get("/mountain",ListingController.mountain);

router.get("/farming",ListingController.farming);

router.get("/rain",ListingController.rain);

router.get("/sun",ListingController.sun);

router.get("/ship",ListingController.ship);

//  create & new Route
router.get("create",isloggedIn,ListingController.renderCreateform);


// show Route
router.get(":id",ListingController.renderShow);

// router.post("/" ,validateListing ,wrapAsync(ListingController.Createfunction));
router.post('/',isloggedIn,upload.single('listing[image]'),wrapAsync(ListingController.Createfunction))

//  Edit Route
router.get(":id/edit",isloggedIn,isOwner,ListingController.renderEditform);
 router.put("/:id",isloggedIn,isOwner,upload.single('listing[image]'),ListingController.editfunction);

//  Delete Route
router.delete(":id",isloggedIn,wrapAsync(ListingController.destroy));
module.exports=router;
