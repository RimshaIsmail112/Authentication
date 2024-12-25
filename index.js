const express= require ('express');
const app=express();
const User=require ('./models/user');
const mongoose=require('mongoose');
// Bcrypt Passowrd
const bcrypt=require('bcrypt');
// For seeions
const session=require('express-session');

// To connect With MongoDB to mongoose
mongoose.connect('mongodb://localhost:27017/loginDemo', {useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>{
    console.log("Mongo Connection is Successfully Open Now!!")
})
.catch(err=>{
    console.log("OOPS!! NO MongoDB Connection Occured!!")
    console.log(err)
})








app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended:true}));
// For session
app.use(session({secret:'This is Not Good Secret'}))

app.get('/',(req,res)=>{
    res.send('Home Page')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

// To register New User
app.post('/register',async (req,res)=>{
    // res.send(req.body) -->we cannot save passowrd as user entered in DB
    const{password,username}=req.body;
    const hash=await bcrypt.hash(password,12);
    // Creating User
    const user=new User({
        username,
        password:hash
    })
    // Performing Authentication
    await user.save();
    // For session
    req.session.user_id=user._id;
    // res.send(hash)
    res.redirect('/');

})
app.get('/login',(req,res)=>{
    res.render('Login')
})
app.post('/login',async(req,res)=>{
    // Save Username & Password as JSON onject
    // res.send(req.body)
    const{username,password}=req.body;
    const user=await User.findOne({username});
    const validpassword=await bcrypt.compare(password,user.password);
    if(validpassword){
        // store user id in session
        req.session.user_id=user._id;
        // res.send("YOU SUCCESSFULLY LOGIN!!");
        res.redirect('/secret');

    }else{
        // res.send("PLease TRY AGAIN!!")
        res.redirect('/login');
    }
})
// Logout Functionality
app.post('/logout',(req,res)=>{
    // req.session.user_id=null;
    req.session.destroy();
    res.redirect('/login')
})





app.get('/secret',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    res.render("Secret")
})

app.listen(3000,() =>{
    console.log("Serving Your App!")
})