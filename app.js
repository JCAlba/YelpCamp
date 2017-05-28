var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
            {name: "La Guaira", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
            {name: "Pto. Azul", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
            {name: "Lagunita", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
        ]
    
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});