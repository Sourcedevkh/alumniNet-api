const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumniNet", // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },// optional: auto resize
      { quality: "auto:eco", fetch_format: "auto" }, // ជួយបង្រួមទំហំ file ឲ្យតូចបំផុតតែរូបភាពនៅច្បាស់
    ], 
  },
});

const uploadImg = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // កំណត់ទំហំត្រឹម 2MB (គិតជា Bytes)
  },
});

module.exports = uploadImg;
