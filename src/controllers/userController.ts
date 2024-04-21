import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //! VALIDATION
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  const user = User.findOne({ email });
  if (!user) {
    const error = createHttpError("User already exists. Please Login");
    return next(error);
  }

  //! ENCRYPT PASSWORD
  const hashedPassword = await bcrypt.hash(password, 8);

  //! SAVE TO DATABASE
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // !GENERATE JWT TOKEN

  const accessToken = jwt.sign(
    { sub: newUser._id },
    config.jwtSecret as string,
    { expiresIn: "2d" }
  );

  // !SEND RESPONSE BACK TO CLIENT
  res.json({
    message: "User Created Successfully",
    _id: newUser._id,
    accessToken,
  });
};

export { createUser };
