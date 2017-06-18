var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Naiguata",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "blah blah blah"
    },
    {
        name: "Restrepo",
        image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg/",
        description: "blah blah blah"
    },
    {
        name: "Caurimare",
        image: "https://farm6.staticflickr.com/5059/5518252117_d232831997.jpg",
        description: "blah blah blah"
    }
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            data.forEach(function(seed){
               Campground.create(seed,function(err, campground){
                   if(err){
                       console.log(err);
                   } else {
                       console.log("added a campground");
                       Comment.create({
                           text:"This place is horrible.",
                           author: "Daddy Yankee"
                       }, function(err, comment){
                           if(err){
                               console.log(err);
                           } else {
                               campground.comments.push(comment);
                               campground.save();
                               console.log("Created new comment");
                           }
                       });
                   }
               }) 
            });
            console.log("removed campgrounds");
        }
    });
};

module.exports = seedDB;
