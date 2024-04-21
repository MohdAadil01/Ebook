import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.files);
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log(uploadResult);

    res.send("hi");
  } catch (error) {
    console.log(error);
  }
};
