var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Naiguata",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquet non dui eget elementum. Curabitur semper feugiat arcu sit amet laoreet. Proin et arcu sem. In hac habitasse platea dictumst. Phasellus aliquam non ipsum a sollicitudin. Etiam blandit magna ut justo rhoncus tristique. Aenean accumsan metus ac arcu consectetur venenatis. Nam ac justo non nulla viverra venenatis. Mauris et efficitur est. Proin eget rhoncus sem. Fusce auctor neque a velit scelerisque interdum. Curabitur blandit purus at elit malesuada efficitur. Ut quis ultrices sem, non feugiat enim. Vestibulum facilisis, nibh id luctus fermentum, orci ligula mattis risus, a egestas nulla sapien vitae nunc. Nulla non sodales sapien."
    },
    {
        name: "Restrepo",
        image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg/",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquet non dui eget elementum. Curabitur semper feugiat arcu sit amet laoreet. Proin et arcu sem. In hac habitasse platea dictumst. Phasellus aliquam non ipsum a sollicitudin. Etiam blandit magna ut justo rhoncus tristique. Aenean accumsan metus ac arcu consectetur venenatis. Nam ac justo non nulla viverra venenatis. Mauris et efficitur est. Proin eget rhoncus sem. Fusce auctor neque a velit scelerisque interdum. Curabitur blandit purus at elit malesuada efficitur. Ut quis ultrices sem, non feugiat enim. Vestibulum facilisis, nibh id luctus fermentum, orci ligula mattis risus, a egestas nulla sapien vitae nunc. Nulla non sodales sapien.h"
    },
    {
        name: "Caurimare",
        image: "https://farm6.staticflickr.com/5059/5518252117_d232831997.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquet non dui eget elementum. Curabitur semper feugiat arcu sit amet laoreet. Proin et arcu sem. In hac habitasse platea dictumst. Phasellus aliquam non ipsum a sollicitudin. Etiam blandit magna ut justo rhoncus tristique. Aenean accumsan metus ac arcu consectetur venenatis. Nam ac justo non nulla viverra venenatis. Mauris et efficitur est. Proin eget rhoncus sem. Fusce auctor neque a velit scelerisque interdum. Curabitur blandit purus at elit malesuada efficitur. Ut quis ultrices sem, non feugiat enim. Vestibulum facilisis, nibh id luctus fermentum, orci ligula mattis risus, a egestas nulla sapien vitae nunc. Nulla non sodales sapien."
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
