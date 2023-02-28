const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.post_user = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      console.log("trying");
      const user = new User({
        id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: "user created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
};
exports.login_user = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "invalid credentials",
      });
    }
    if (isMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "logged in sucessfully",
        token:token
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "server errorcmd",
      
    });
  }
};
