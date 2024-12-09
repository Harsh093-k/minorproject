const cloudinary = require('cloudinary').v2;
const{CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:process.env.Cloud_name,
    api_key:process.env.Cloud_API_key,
    api_secret:process.env.Cloud_API_Secret

});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_DEV',
      allowerdformats :["png","jpg","jpeg"],
    },
  });

module.exports = {
    cloudinary,
    storage,
}; 