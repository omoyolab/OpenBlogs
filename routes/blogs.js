var express = require("express");
var router = express.Router();
var Blog   = require("../models/blog");
var middleware = require("../middleware");


//SHOW ALL BLOGS
router.get("/", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        }else{
          res.render("index", {blogs:blogs, currentUser:req.user});
        }
        
    });
});


// NEW ROUTE
router.get("/new",isloggedIn, function(req, res){
        console.log(req.user);
        res.render("blogs/new");
});

// CREATE ROUTE

router.post("/", isloggedIn, function (req, res) {
 
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    var title = req.body.blog.title;
    var image = req.body.blog.image;
    var body = req.body.blog.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newBlog = {title: title, image: image, body: body, author: author};
    
    Blog.create(newBlog, function (err, createdBlog) {
        if (err) {
            res.render("/blogs/new");
        } else {
            // console.log(createdBlog);
            // console.log("Blog successfully created.");
            res.redirect("/blogs");
        }
 
    });
 
});



// SHOW SINGLE BLOG
router.get("/:id", function(req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
         if(err){
            res.redirect("/blogs"); 
         }else{
            res.render("blogs/show",{blog:foundBlog}); 
         }
        
    });
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkBlogOwnership, function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        
        if (err){
            res.render("/blogs");
            
        }else res.render("blogs/edit",{blog:foundBlog});
    });
    
   
    
});

//UPDATE ROUTE
router.put("/:id",middleware.checkBlogOwnership, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
           
       }else{
           res.redirect("/blogs/" + req.params.id);
       }
       
   });
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        
        if (err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
        
    });
    
    
});


function isloggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
res.redirect("/login");
}


module.exports = router;