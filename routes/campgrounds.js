var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//===================
// CAMPGROUND ROUTES
//===================

router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, Campgrounds){
        if(err){
            console.log("Error finding camgrounds in db");
        } else {
            res.render("campgrounds/index", {campgrounds:Campgrounds});
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //create a new campground a save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Campground could not be created");
            console.log(err);
        } else {
            req.flash("success", "Campground successfully posted");
            res.redirect("/campgrounds"); 
        }
    });
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGOURND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function( req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
