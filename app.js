var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//PASSPORT CONFIGUTARION
app.use(require("express-session")({
    secret: "I love food",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
// AUTH ROUTES
// show register form

app.get("/register", function(req, res){
   res.render("register"); 
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    res.send("Login logic");
});

// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});