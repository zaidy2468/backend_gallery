const mongoose = require("mongoose");
const _users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup_user = async (req, res, next) => {
  const { email } = req.body;
  if (await _users.findOne({ email })) {
    res.status(500).json({
      message: "email already exists",
    });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        console.log("trying");
        const user = new _users({
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
              userId: user._id,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  }
};
exports.login_user = async (req, res, next) => {
  console.log("best");
  try {
    console.log("matched");
    const { email, password } = req.body;
    const user = await _users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(404).json({
        message: "invalid credentials",
      });
    }
    if (isMatch) {
      console.log("matched");
      console.log(process.env.SECRET_KEY);
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
      const loggedInUser = await _users.findByIdAndUpdate(user._id, { token });
      console.log(loggedInUser);
      res.status(200).json({
        message: "logged in sucessfully",
        token: token,
        user: loggedInUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server errorcmd",
      error: error,
    });
  }
};
exports.add_user_images = async (req, res, next) => {
  try {
    const name = req.file;
    console.log(name);

    const userId = req.query.userId;
    console.log(userId);
    console.log("errrror");
    const uploadImage = await _users.updateOne(
      { _id: userId },
      { $addToSet: { image: name } }
    );
    console.log(uploadImage);
    res.status(200).json({
      message: "user image uploaded",
      file: name,
    });
  } catch {
    res.status(500).json({
      message: "server error",
    });
  }
};
exports.logout_user = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const logoutUser = await _users.findByIdAndUpdate(
      userId,
      { token: "" },
      { new: true }
    );
    console.log(logoutUser);
    res.status(200).json({
      message: "user successfully logged out",
      user: logoutUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "couldn't logout the user",
      error: err,
    });
  }
};
exports.get_user_images = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const userImages = await _users.findById(userId).select("image");
    console.log("userimages" + userImages);
    res.status(200).json({
      message: "got user images",
      images: userImages,
    });
  } catch (err) {
    res.status(500).json({
      message: "error in  getting images",
      error: err,
    });
  }
};
