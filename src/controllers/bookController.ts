import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import Book from "../models/Book";
import fs from "fs";
import { AuthRequest } from "../middlewares/authenticate";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, genre } = req.body;
    // console.log(req.files);
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../public/data/uploads/" + fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    // console.log(uploadResult);

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../public/data/uploads/" + bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    // console.log(bookFileUploadResult);

    const _req = req as AuthRequest;

    const newBook = await Book.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res
      .status(201)
      .json({ message: "Successfully created new book", id: newBook._id });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading files"));
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;
    const foundBook = await Book.findOne({ _id: bookId });
    if (!foundBook) {
      return next(createHttpError(404, "Book Not Found."));
    }
    let _req = req as AuthRequest;
    if (foundBook.author.toString() !== _req.userId) {
      return next(
        createHttpError(404, "You are not allowed to update this book.")
      );
    }

    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    let completeCoverImage = "";
    if (files.coverImage) {
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const fileName = files.coverImage[0].filename;
      const filePath = path.resolve(
        __dirname,
        "../public/data/uploads/" + fileName
      );

      completeCoverImage = fileName;

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
      // console.log(uploadResult);
    }

    let completeFileName = "";
    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../public/data/uploads/" + bookFileName
      );

      completeFileName = bookFileName;

      const bookFileUploadResult = await cloudinary.uploader.upload(
        bookFilePath,
        {
          resource_type: "raw",
          filename_override: completeFileName,
          folder: "book-pdfs",
          format: "pdf",
        }
      );

      completeFileName = bookFileUploadResult.secure_url;

      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage
          ? completeCoverImage
          : foundBook.coverImage,
        file: completeFileName ? completeFileName : foundBook.file,
      },
      { new: true }
    );
    res.status(200).json({ message: "Successfully update Book", updatedBook });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while updating book."));
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // !Add pagination
    const allBooks = await Book.find({});

    res.status(200).json({ allBooks });
  } catch (error) {
    return next(createHttpError(500, "Error while getting books."));
  }
};

export const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const foundBook = await Book.findOne({ _id: bookId });
    if (!foundBook) {
      return next(createHttpError(400, "No book found with this name/id."));
    }
    res.status(200).json({ message: "Book found", foundBook });
  } catch (error) {
    return next(createHttpError(500, "Error while getting a book."));
  }
};
