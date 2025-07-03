export const uploadImage = async (req, res) => {
  try {
    const images = req.files.map(file => file.path);

    res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls: images
    });

  } catch (error) {
    res.status(500).json({
      message: 'Upload failed',
      error: error.message
    });
  }
};
