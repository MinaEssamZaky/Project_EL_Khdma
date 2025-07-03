export const uploadImage = async (req, res) => {
  try {
    // 👀 اختبر البيانات المستلمة من multer
    const debugInfo = {
      files: req.files || null,
      body: req.body || null,
      message: '',
    };

    if (!req.files || req.files.length === 0) {
      debugInfo.message = 'No images were uploaded';
      return res.status(400).json(debugInfo);
    }

    const imageUrls = req.files.map(file => file.path);

    return res.status(200).json({
      message: 'Images uploaded successfully ✅',
      imageUrls,
      files: req.files,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Upload failed ❌',
      error: error.message,
      name: error.name,
      stack: error.stack,
    });
  }
};
