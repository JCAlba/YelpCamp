var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//SCHEMMA SETUP FOR MONGOOSE

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "La Guaira",
//         image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"
//     }, 

//     function(err,campground){
//         if(err){
//             console.log("Error creating campground");
//         } else {
//             console.log("Campground created");
//             console.log(campground);
//         }
// });

// Campground.create({
//         name: "Pto. Azul",
//         image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"
//     }, 

//     function(err,campground){
//         if(err){
//             console.log("Error creating campground");
//         } else {
//             console.log("Campground created");
//             console.log(campground);
//         }
// });

// var campgrounds = [
//         {name: "La Guaira", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//         {name: "Pto. Azul", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
//         {name: "Lagunita", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
//         {name: "La Guaira", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//         {name: "Pto. Azul", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
//         {name: "Lagunita", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
//         {name: "La Guaira", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//         {name: "Pto. Azul", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
//         {name: "Lagunita", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
//     ]
    
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, Campgrounds){
        if(err){
            console.log("Error finding camgrounds in db");
        } else {
            res.render("campgrounds", {campgrounds:Campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds"); 
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});