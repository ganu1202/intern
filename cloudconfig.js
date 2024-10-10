const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')


// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// });

cloudinary.config({
    cloud_name: 'dmi65gqxz',
    api_key: '299727714219343',
    api_secret: 'QZknOqlXhtxlgAkBC2NQCZm_feM'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'emp_dev',
      allowedFormats:['png','jpeg','jpg','pdf'], // supports promises as well
      public_id: (req, file) => 'computed-filename-using-request',
    },
});



module.exports={
    cloudinary,
    storage
}