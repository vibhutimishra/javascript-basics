const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDB");
const schema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret";
schema.plugin(encrypt,{secret:secret});

const User = new mongoose.model("User", schema);


app.get("/",function(req,res){
    res.render("home.ejs");
});
app.get("/login",function(req,res){
    res.render("login.ejs");
});
app.get("/register",function(req,res){
    res.render("register.ejs");
});

app.post("/register",function(req,res){
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets.ejs");
        }
    });
});


app.post("/login",function(req,res){
    const username= req.body.username;
    const password= req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets.ejs");
                }
            }
        }
    });
    
});


app.listen("3000",function(req,res){
    console.log("server started");
});