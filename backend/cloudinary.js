const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'Recipe',
  api_key: '368667218665533',
  api_secret: 'AF3nNzF3u2nIs2Ri_f2tea5w1LQ'
});

module.exports = cloudinary;