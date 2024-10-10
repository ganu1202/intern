require('dotenv').config();//pkg helpful for managing env variables, env variables contain configuration settings such as database credentials, api keys, etc.. for security purpose.
// console.log('Cloudinary Credentials:', process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);
console.log(process.secret);
const express=require('express')
const app=express()
const port=8080
const mongoose=require('mongoose')
const Employee=require('./models/emp');
const User=require("./models/user.js");
const engine=require('ejs-mate')
app.engine('ejs',engine);
const multer  = require('multer')
const {storage}=require("./cloudconfig.js");
const upload = multer({storage});
const session = require('express-session');
const MongoStore = require('connect-mongo');
let {savedRedirectUrl, isLoggedIn,ValidateEmployee}=require("./middleware.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname, 'public')));
const methodOverride = require('method-override');

// Middleware to use _method for overriding
app.use(methodOverride("_method"));
const flash = require('connect-flash');
app.use(flash());
const ExpressError=require('./ExpressError.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');
app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
})
const dbURL="mongodb://127.0.0.1:27017/employee"

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:"fjdklsfdccc"
    },
    touchAfter: 24*3600,
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})


const sessionOptions={
    store,
    secret:"fjdklsfdccc",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,//security purpose
    }
}




app.use(session(sessionOptions));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.send('hello');
})

main().then(()=>{
    console.log('connection successful');
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbURL);
}

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
})


// const sampleEmployee = new Employee({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     mobileNo: "1234567890",
//     designation: "Software Engineer",
//     gender: "Male",
//     course: "Computer Science",
//     // createDate will be set automatically by default
// });

// // Save the sample employee to the database
// sampleEmployee.save()
//     .then(() => {
//         console.log("Employee added successfully");
//     })
//     .catch(err => {
//         console.log("Error adding employee:", err);
// });

app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})

app.get("/employeeList",isLoggedIn,async(req,res)=>{
    const allEmp=await Employee.find({});
    let totalEmp=await Employee.countDocuments();
    res.render("employeeList.ejs",{allEmp,totalEmp});
})
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})

app.post('/signup',async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        console.log(req.body);
        let newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if (err) return next(err);
            res.redirect('/home');
        })
    }catch(err){
        console.log(err);
        res.redirect("/signup");
    }
});

app.post('/login',passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),(req,res)=>{
    let redirectUrl="home"
    res.redirect(redirectUrl);
})

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/home");
    })
})

app.get('/home',async (req,res)=>{
    let totalEmp=await Employee.countDocuments();
    res.render('home.ejs',{totalEmp});
})

app.get('/employee',isLoggedIn,(req,res)=>{
    res.render('new.ejs');
})

app.post('/employee',isLoggedIn,upload.single("Employee[image]"),ValidateEmployee,async(req,res)=>{
    try{
        const newEmp=new Employee(req.body.Employee);
        let url=req.file.path;
        let filename=req.file.filename;
        newEmp.image={url,filename};
        let savedEmp=await newEmp.save();
        console.log(savedEmp);
        res.redirect('/home');
    }catch(error) {
        if (error.code === 11000) {
            console.log('Error: Email already exists');
            // Return or throw an error message for duplicate email
            return { message: 'Email already exists' };
        } else {
            console.error('Error adding employee:', error);
            // Return or throw a generic error message
            return { message: 'Error adding employee' };
        }
    }
    
});

app.get('/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    try {
        const emp = await Employee.findById(id);

        if (!emp) {
            return res.redirect("/home");
        }

        // Check if the employee has an image and if it contains a URL
        const originalUrl = emp.image && emp.image.url ? emp.image.url : ''; // Default to an empty string if URL doesn't exist
        const URL = originalUrl ? originalUrl.replace("/upload", "/upload/w_250") : ''; // Only modify the URL if it exists

        res.render('edit.ejs', { emp, URL });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error"); // Optionally render an error page here
    }
});


app.put('/employee/:id', isLoggedIn, async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, {...req.body.Employee});
        if(typeof req.file!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
            await listing.save();
        }
        if (!employee) {
            throw new ExpressError('Employee not found', 404);
        }
        res.redirect("/employeeList")
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});




app.delete('/employees/:id',isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Employee.findByIdAndDelete(id);
    res.redirect("/home");
    console.log(deletedListing);
})



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));       //When users sends a request to route to which request is not handled or route handler is defined.
});


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err; // Destructure status and message
    res.status(status).render("error.ejs",{message}); // Send error response
});

