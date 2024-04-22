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

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../public/data/uploads",
      bookFileName
    );
    const fileMimeType = files.file[0].mimetype;

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    console.log(bookFileUploadResult);

    res.send("hi");
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading files"));
  }
};
