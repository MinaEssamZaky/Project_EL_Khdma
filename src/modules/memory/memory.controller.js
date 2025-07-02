
export const uploadImage = async (req, res) => {
  try {
    // Cloudinary بيرجع رابط مباشر للصورة في req.file.path
    const imageUrl = req.files.path;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl
    });

  } catch (error) {
    res.status(500).json({
      message: 'Upload failed',
      error: error.message
    });
  }
};
