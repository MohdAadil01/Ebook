import express from "express";
import {
  createBook,
  updateBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
} from "../controllers/bookController";
import multer from "multer";
import path from "path";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);
router.put(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

router.get("/", getAllBooks);

router.get("/:bookId", getSingleBook);

router.delete("/:bookId", authenticate, deleteBook);
export default router;
