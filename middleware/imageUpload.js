const cloudinary = require("./cloudinaryConfig");

async function get_image_url(buffer) {
  const upload_stream = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });
  return upload_stream.secure_url;
}

module.exports = get_image_url;
