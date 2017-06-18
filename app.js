var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();


// Campground.create({
//         name: "La Guaira",
//         image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
//         description: "This place is horrible, don't come here."
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
            res.render("campgrounds/index", {campgrounds:Campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds"); 
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//=================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    //Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});