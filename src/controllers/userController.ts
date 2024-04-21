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

  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exists. Please Login");
      return next(error);
    }
  } catch (error) {
    return next(
      createHttpError(500, "Error in finding user in database" + error)
    );
  }

  //! ENCRYPT PASSWORD
  const hashedPassword = await bcrypt.hash(password, 8);

  //! SAVE TO DATABASE
  let newUser: User;
  try {
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error in creating user " + error));
  }

  // !GENERATE JWT TOKEN
  try {
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
  } catch (error) {
    return next(createHttpError(500, "Error in signing jwt token " + error));
  }
};

export { createUser };
