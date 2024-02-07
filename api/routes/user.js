const express = require("express");
const user = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");
/*const upload=require("../middlewares/uploadImage")*/
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
router.post("/signup", user.signup_user);
router.post("/login", user.login_user);
router.post("/image", checkAuth, upload.single("image"), user.add_user_images);
router.get("/getImages", checkAuth, user.get_user_images);
router.get("/logout", user.logout_user);
router.get("/p",  (req, res, next) => {
  res.send("hello");
});
module.exports = router;
