const express=require("express");
const body=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");


const app=express();
app.use(express.static("public"));
app.use(body.urlencoded({extended:true}));
// app.use(session({
// secret:"Our little secret.",
// resave:false,
// saveUninitialized:false
//
// }));
// app.use(passport.initialize());
// app.use(passport.session());



mongoose.connect("mongodb+srv://admin-anurag:20675256@cluster0.ndeft.mongodb.net/studentDB",{useNewUrlParser:true});
// mongoose.set("useCreateIndex",true);

const studentSchema=new mongoose.Schema({
fName:String,
lName: String,
email: String,
password:String
});
// studentSchema.plugin(passportLocalMongoose);

const secret ="This is my secret";

studentSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const Student =mongoose.model("Student",studentSchema);
// passport.use(Student.createStrategy());
// passport.serializeUser(Student.serializeUser());
// passport.deserializeUser(Student.deserializeUser());


app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});



app.post("/register",function(req,res){
  const newStudent= new Student({
    fName:req.body.fname,
    lName:req.body.lname,
    email:req.body.email,
    password:req.body.psw
  });
newStudent.save(function(err){
  if(err)
  console.log(err);
  else
  {console.log("Successful");
    res.sendFile(__dirname+"/loggedin.html");
  }
});
// Student.register({username:req.body.email},req.body.psw,function(err){
//   if(err)
//   {
//     console.log(err);
//     res.sendFile(__dirname+"/index.html");
//   }else{
//     passport.authenticate("local")(req,res,function(){
//       res.sendFile(__dirname+"/loggedin.html");
//     });
//   }
// });

});
// app.get("/loggedin",function(req,res){
//
// if(req.isAuthenticated()){
//   res.sendFile(__dirname+"/loggedin.html");
// }else{
//   res.sendFile(__dirname+"/index.html");
// }
//
// });
app.get("/logout",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
app.post("/login",function(req,res){
   const temail=req.body.email;
   const tpass=req.body.psw;
  //console.log(req.body);
Student.findOne({email:temail},function(err,foundStudent){
  if(err)
  console.log(err);
  else{
    if(foundStudent.password==tpass){
      res.sendFile(__dirname+"/loggedin.html");
    }else{
      console.log("not pass");
    }
  }
});
});



app.listen(process.env.PORT||3000,function(){
  console.log("successful");
});
