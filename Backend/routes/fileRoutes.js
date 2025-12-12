import express from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../controllers/fileController.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:fileId", deleteFile);

export default router;
