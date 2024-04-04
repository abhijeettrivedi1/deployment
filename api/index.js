const express = require('express')
const fs= require('fs')
const app = express()
const bcrypt= require('bcryptjs')
const cors= require('cors');
require("dotenv").config()
const  mongoose = require('mongoose');
const User = require('./models/user');
const Place = require('./models/place');
const bcryptsalt=  bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken")
const jwtSecret = "mdskjadskjbkjzxzgk";
const cookieParser = require("cookie-parser");
const imageDownloader=require("image-downloader");
const multer=require("multer");
const Booking = require('./models/booking');
app.use("/uploads",express.static(__dirname+'/uploads'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials:true,
  origin:"http://localhost:5173",
}));
 mongoose.connect(process.env.mongo_uri)
 .then(()=>console.log('Connected to Mongo'))
 .catch((err)=>console.log(err));

app.get('/test', (req, res) => {
  res.json('Hello World!')
});
app.post("/register", async(req, res) => {
  const {name,email,password} = req.body;
  try{
    const userDoc=await User.create({name,
      email,
      password:bcrypt.hashSync(password,bcryptsalt)
    })
    res.json(userDoc)
  
  }catch(e){
    res.status(422).json(e);
  }
  
})
app.post("/login", async(req, res) =>{
  const {email,password}=req.body;
  const userdoc=await User.findOne({email})
  if(!userdoc){
    res.status(422).json("Invalid Credentials")
  }
  else{
    if(bcrypt.compareSync(password,userdoc.password)){
      jwt.sign({email:userdoc.email,id:userdoc._id},jwtSecret,{},(err,token)=>{
        if(err) throw err;
        else{
          res.cookie("token",token).json(userdoc)
        }
      })
    }
    else{
      res.status(422).json("Invalid Credentials")
    }
  }
})

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, userdata) => {
      if (err) {
        res.status(422).json(err);
      } else {
        try {
          const { name, email, _id } = await User.findById(userdata.id); // Fix here
          res.json({ name, email, _id });
        } catch (error) {
          res.status(422).json(error);
        }
      }
    });
  } else {
    res.json(null);
  }
});


app.post("/logout", (req, res) => {
  res.cookie("token","").json(true);
})
app.post("/upload-by-link", async(req, res) => {
  const {link}=req.body
  const newName="photo"+Date.now()+".jpg"
  await imageDownloader.image({
    url:link,
    dest:__dirname + "/uploads/"+newName,
  })
  res.json(newName);
})
const photosmiddleware=multer({dest:"uploads/"})
app.post('/upload',photosmiddleware.array('photos',100),(req, res) => {
  const uploadedfiles=[];
for(let i=0;i<req.files.length;i++) {
  const {path,originalname}=req.files[i];
  const parts=originalname.split(".")
  const ext=parts[parts.length-1]
  const newpath=path +"."+ext;
  fs.renameSync(path,newpath)
  uploadedfiles.push(newpath.replace("uploads\\",""))
}
res.json(uploadedfiles);    
})
app.post("/places",(req, res) => {
  const { token } = req.cookies;
  const {title,address,addedphotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
  jwt.verify(token, jwtSecret,{}, async (err, userdata) => {
    if (err) {
      throw err;
    }
    const placeDoc=await Place.create({
      owner:userdata.id,
      title,address,photos:addedphotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price
    })
    res.json(placeDoc);
  });
})
app.get("/user-places",(req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, async (err, userdata) => {
      const{id}=userdata;
      res.json(await Place.find({owner:id}))
  });
})
app.get("/places/:id",async (req, res) => {
  const{id}=req.params;
  res.json(await Place.findById(id))
})

app.put("/places",async (req, res) => {

  const { token } = req.cookies;
  const {id,title,
    address,
    addedphotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,price}=req.body;
    jwt.verify(token, jwtSecret, async (err, userdata) => {
      
      const placeDoc=await Place.findById(id);
      if(userdata.id===placeDoc.owner.toString()){
        
       placeDoc.set({
        title,
        address,
        photos:addedphotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,price
       })
       await placeDoc.save()
       res.json("ok")
      }
      
  });

})

app.get("/places",async(req,res) => {
  res.json(await Place.find())
})

app.post("/bookings",async (req,res)=>{
  const userdata=await getuserdatafromtoken(req);
  const {place,checkIn,checkOut,numberofGuests,name,phone,price}=req.body;
   Booking.create({
    place,checkIn,checkOut,numberofGuests,name,phone,price,user:userdata.id
  }).then((doc)=>{
    
    res.json(doc)
    
  })
  .catch((err)=>{
    throw err
  })
})

function getuserdatafromtoken(req){
    return new Promise((resolve,reject)=>{
      jwt.verify(req.cookies.token, jwtSecret, async (err, userdata) => {
        if(err) throw err;
        else{
          resolve(userdata);
        }
      });
    })
    
}
app.get("/bookings",async (req,res)=>{
  const userdata=await getuserdatafromtoken(req)
  res.json(await Booking.find({user:userdata.id}).populate("place")) 
})
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})