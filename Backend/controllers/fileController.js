import cloudinary from "../utils/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ fileId: result.public_id, url: result.secure_url });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteFile = async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.fileId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};
