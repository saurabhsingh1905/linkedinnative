const express = require("express")
const bodyParser = require ("body-parser")
const mongoose = require ("mongoose")
const crypto = require ("crypto")
const nodemailer = require ("nodemailer")

const app = express()
const port = 8001;
const cors = require ("cors")
app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))
app.use (bodyParser.json());

// mongodb+srv://singhsaurabh1905:<password>@cluster0.egpio4s.mongodb.net/
mongoose.connect("mongodb+srv://singhsaurabh1905:gfXz1k0juLsMV3Vh@cluster0.egpio4s.mongodb.net/",
{useNewUrlParser:true,
useUnifiedTopology:true}
).then(()=> {
    console.log("Connected to mongoDb")
}).catch((err)=>{
    console.log("Error connecting to mongoDb",err)
})

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})