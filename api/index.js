const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("./models/user");
const Post = require("./models/post");
const jwt = require("jsonwebtoken");
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
    console.log(req.body);

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

    res.status(202).json({
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
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error sending the verification email", err);
  }
};

//ENDPOINT TO VERIFY THE EMAIL===========================================================================
app.get("/verify/token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Email verification not done", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

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

    const token = jwt.sign({ userId: user._id }, secretKey);
    // console.log("aaya na maja",user._id)

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//ENDPOINT TO FETCH THE USERS PROFILE======================================================================

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

//ENDPOINT TO SHOW ALL THE USER WHICH ARE registered EXCEPT THE LOGEDIN USERID
app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    //fetch the logged-in user's connections
    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    //get the ID's of the connected users
    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

    //find the users who are not connected to the logged-in user Id
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

//ENDPOINTS TO CONNECT TO ANY PARTICULAR USER IN THE NETWORK PAGE========================================
app.post("/connection-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //selecteduser is the one jisko request bhej rahe hai || so we updated in that user connectionrequest
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { connectionRequests: currentUserId },
    });

    //update in currentuser connectionrequest that is to whom connection is being sent
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentConnectionRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating connection request to users" });
    console.log("Error in sending connection request", error);
  }
});

//ENDPOINT TO ShOW ALL OF THE CONNECTIONS=================================================================
app.get("/connection-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("connectionRequests", "name email profileImage")
      .lean();

    const connectionRequests = user.connectionRequests;

    res.json(connectionRequests);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in getting all connections" });
  }
});

//ENDPOINT TO ACCEPT A CONNECTION REQUEST===============================================================
app.post("/connection-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.connections.push(recepientId);
    recepient.connections.push(senderId);

    recepient.connectionRequests = recepient.connectionRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request acccepted" });
  } catch (error) {
    console.log("Error in accepting the connection request", error);
    res.status(500).json({
      message: "Internal Server Error in acception connection request",
    });
  }
});

//ENDPOINT FOR DECLING THE CONNECTION REQUEST============================================================
app.post("/connection-request/decline", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.connections.pop(recepientId);
    recepient.connections.pop(senderId);

    recepient.connectionRequests = recepient.connectionRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.log("Error in declining the connection request", error);
    res.status(500).json({
      message: "Internal Server Error in declining connection request",
    });
  }
});

// ENDPOINT TO FETCH ALL THE CONNECTION OF THE USER=========================================================
app.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("connections", "name profileImage createdAt")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    res.status(200).json({ connections: user.connections });
  } catch (error) {
    console.log("error fetching the connections", error);
    res.status(500).json({ message: "Error fetching the connections" });
  }
});

//ENDPOINT TO CREATE A POST===============================================================================
app.post("/create", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;

    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      user: userId,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("Error creating a post", error);
    res.status(500).json({ message: "Error while creating post of the user" });
  }
});

//ENDPOINT TO FETCH ALL OF THE POST =====================================================================
app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

//ENDPOINT TO LIKE A POST=================================================================================
app.post("/like/:postId/:userId", async () => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    //check if the user has already liked the post
    const existingLike = post?.likes.find(
      (like) => like.user.toString() === userId
    );

if(existingLike){
  post.likes = post.likes.filter((like)=>  like.user.toString() !== userId)
}else{
  post.likes.push({user:userId})
}

await post.save()
res.status(200).json({message:"Post like/unlike successfull",post})

  } catch (error) {
    console.log("error liking the posts", error);
    res.status(500).json({ message: "Error liking the posts of user" });
  }
});


//ENDPOINT TO UPDATE USER DESCRIPTION===================================================================
app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userDescription } = req.body;

    await User.findByIdAndUpdate(userId, { userDescription });

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log("Error updating user Profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});