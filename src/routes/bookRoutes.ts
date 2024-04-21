import express from "express";
import { createBook } from "../controllers/bookController";
import multer from "multer";
import path from "path";

const router = express.Router();

const upload = multer({
  dest: path.resolve(__dirname + "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default router;
