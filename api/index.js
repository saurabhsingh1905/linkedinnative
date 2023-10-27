const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("./models/user");
const Post = require("./models/post");
const jwt = require("jsonwebtoken")
const app = express();
const port = 8001;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongodb+srv://singhsaurabh1905:<password>@cluster0.egpio4s.mongodb.net/
mongoose
  .connect(
    "mongodb+srv://singhsaurabh1905:gfXz1k0juLsMV3Vh@cluster0.egpio4s.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to mongoDb");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDb", err);
  });

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});



//ENDPOINT FOR REGISTERING A USER IN THE BACKEND==========================================================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    console.log(req.body)

    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already exists, try with different email");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new user
    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });

    //generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send the verification email to the registerd user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res
      .status(202)
      .json({
        message: "Registration successful please check hour email to verify",
      });
  } catch (error) {
    console.log("Error registering the user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

//SENDVERIFICATIONEMAIL function==========================================================================

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "singhsaurabh1905@gmail.com",
        pass: "drqonvgeuicsuvlp",
      },
    });
  
    const mailOptions = {
      from: "Linkedin@gmail.com",
      to: email,
      subject: "Email verification",
      text: `Please click the link to verify your email account with linkedin : http://localhost:8001/verify/${verificationToken}`,
    };
  
    //send the mail
    try {
      await transporter.sendMail(mailOptions)
      console.log("Verification email sent successfully")
    } catch (error) {
      console.log("Error sending the verification email",err)
    }
  };


  //ENDPOINT TO VERIFY THE EMAIL===========================================================================
app.get("/verify/token",async(req,res)=>{
    try {
        const token = req.params.token;

        const user = await User.findOne({verificationToken:token})
        if(!user){
            return res.status(404).json({message:"Invalid verification token"})
        }
        
        //mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({message:"Email verified successfully"})
    } catch (error) {
        console.log("Email verification not done",error)
        res.status(500).json({message:"Email verification failed"})
    }
})

//generate secretKey
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
  };
  
  const secretKey = generateSecretKey();


//ENDPOINT FOR LOGIN A USER===============================================================================

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

   //check if the user is present or not
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
      }
  //check if the password is correct
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign( {userId: user._id} , secretKey);
      // console.log("aaya na maja",user._id)
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  

  //ENDPOINT TO FETCH THE USERS PROFILE======================================================================
  app.get("/profile/:userId",async(req,res)=>{
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId)
      if(!user){
        return res.status(404).json({message:"User not found"})
      }
      //if user exists send me the user 
      res.status(200).json({user})

    } catch (error) {
      res.status(500).json({ message: "Error getting the user profile" });
    }
  })

  //ENDPOINT TO SHOW ALL THE USER WHICH ARE registered EXCEPT THE LOGEDIN USERID
  app.get("/users/:userId",async(req,res)=>{ 
  try {
    const loggedInUserId = req.params.userId

    //fetch the loggedin user's connection 
    const loggedInUser = await User.findById(loggedInUserId).populate("connections","_id")
    if(!loggedInUser){
      return res.status(400).json({message:"User not found"})
    }

    //get the ids of all of the connected users 
    const connectedUserIds=loggedInUser.connections.map((connection)=>connection._id)

    //find the users who are not connected to the loggedin user id so this users will be shown in network tab
    const users = await User.find({
      _id:{$ne:loggedInUserId,$nin:connectedUserIds}
    })
    
      res.status(200).json({users})
  } catch (error) {
    console.log("Error retriving users",error)
    res.status(500).json({ message: "Error getting the user profile" });
  }
  })