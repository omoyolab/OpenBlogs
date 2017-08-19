var express = require("express");
var router = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Blog  = require("../models/blog");
var middleware = require("../middleware");


// COMMENT ROUTE

// NEW COMMENT
router.get("/new",middleware.isloggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new" ,{blog:blog});
        }
    });
    
});

//SAVE COMMENT
router.post("/",middleware.isloggedIn, function(req, res){
    Blog.findById(req.params.id ,function(err, blog) {
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
    
});

//EDIT COMMENT
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
 Comment.findById(req.params.comment_id, function(err, foundComment) {
     if(err){
         res.redirect("back");
     }else{
         res.render("comments/edit", {blog_id:req.params.id, comment:foundComment});
     }
     
     
 });

});

//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err,updateComment){
        if(err){
             res.redirect("back");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
             res.redirect("back");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
    
    
});







module.exports = router;