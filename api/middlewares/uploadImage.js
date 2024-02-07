const multer = require("multer");

module.exports = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // use the original filename for uploaded files
    },
  });

  const upload = multer({ storage: storage });
  return upload()
};
