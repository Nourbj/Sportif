const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/;
  const videoTypes = /mp4|webm|ogg|mov|m4v/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = imageTypes.test(ext) && imageTypes.test(file.mimetype);
  const isVideo = videoTypes.test(ext) && videoTypes.test(file.mimetype);

  if (isImage || isVideo) {
    return cb(null, true);
  }
  cb(new Error('Images or videos only! (jpeg, jpg, png, webp, mp4, webm, ogg, mov, m4v)'));
};

const uploadMedia = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter
});

module.exports = uploadMedia;
