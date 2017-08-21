var express      =   require("express"),
bodyParser       =   require("body-parser"),
methodOverride   =   require("method-override"),
mongoose         =   require("mongoose"),
expressSanitizer =   require("express-sanitizer"),
app              =   express();
var User         = require("./models/user");
var Blog         = require ("./models/blog");
var Comment      = require("./models/comment");
var passport =     require("passport");
var LocalStrategy = require("passport-local");
// var expresSsesson = require("express-session");


// ROUTE CONFIG
var commentRoutes = require("./routes/comments"),
    blogRoutes    = require("./routes/blogs"),
    authRoutes    = require("./routes/index");

// APP CONFIG
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://omoyola:london123@ds149373.mlab.com:49373/openblog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// PASSPORT CONFIG

app.use(require("express-session")({
    secret:"campgrounds are awesome",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//CurrentUser config
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


// REFACTAORING ROUTES ROUTES
app.use(authRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);








app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("Server activated!!!");
    
});