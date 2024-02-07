const express = require("express");
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const cors=require("cors")
const User=require('./api/routes/user');
const morgan = require("morgan");
const app = express();
app.use(cors())
mongoose.set('strictQuery',true);
mongoose.connect(process.env.MONGO_KEY);
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/user',User)
app.get("/signin", (req, res) => {
  res.send('helloworld')
});
module.exports=app;