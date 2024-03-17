const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = function (req, file, cb) {
  // Validate the file type if needed
  if (!file.originalname.match(/\.(jpg|png)$/)) {
    return cb(new Error("Only png/jpg files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;