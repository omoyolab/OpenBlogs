var express = require("express");
var router = express.Router();
var Blog   = require("../models/blog");


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
        res.render("blogs/new");
});

// CREATE ROUTE
router.post("/",isloggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog ){
        if(err){
            res.render("blogs/new");
        }else{
           res.redirect("/blogs", {}); 
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
router.get("/:id/edit", function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        
        if (err){
            res.render("/blogs");
            
        }else res.render("blogs/edit",{blog:foundBlog});
    });
    
   
    
});

//UPDATE ROUTE
router.put("/:id", function(req, res){
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
router.delete("/:id", function(req, res){
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