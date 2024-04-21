import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("hi");
};
