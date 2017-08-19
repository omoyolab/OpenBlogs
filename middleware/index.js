var Comment = require("../models/comment");

var middlewareObj ={};

middlewareObj.checkCommentOwnership = function (req, res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            
            }
        });
        
    }else{
        res.redirect("back");
    }
};


middlewareObj.isloggedIn = function  (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
res.redirect("/login");
};












module.exports = middlewareObj