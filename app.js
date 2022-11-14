// if(process.env.NODE_ENV!=="production"){
//   require('dotenv').config();
// }
require('dotenv').config();

const express = require("express");
const flash = require("express-flash");
const bcrypt = require("bcryptjs");
const passport=require("passport");
const cookieParser = require('cookie-parser')
const passportConfig =require('./passport-config');
const session=require('express-session');
const methodOverriding=require('method-override')


passportConfig(passport,
  email=>users.find(user =>user.email===email),
  id=>users.find(user =>user.id===id));

const app = express();

const PORT = 3001;
// app.use(methodOverriding('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
  secret:'ssss',
  resave:false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");


const users = [];

app.get("/",checkAuthenticated, (req, res) => {
  if(req.user.name) {
   return res.render("index",{name:req.user.name});
  }
});
app.get("/login",checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post("/register",checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    
    res.redirect("/login");
  } catch (err) {
    
    res.redirect("/register");
  }
});
app.get("/register",checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
   failureFlash:true

}));
app.get('/logout',(req,res)=>{
  req.session.destroy(function(err) {
    // cannot access session here
  })

res.redirect('/login');

})
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  return next();
}
app.listen(PORT, () => {
  console.log(`server is running at:http://localhost:${PORT}`);
});
