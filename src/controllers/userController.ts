import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    res.status(201).json({
      message: "User Created Successfully",
      _id: newUser._id,
      accessToken,
    });
  } catch (error) {
    return next(createHttpError(500, "Error in signing jwt token " + error));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return next(createHttpError(400, "User does not exist"));
    }
  } catch (error) {
    return next(
      createHttpError(500, "Error in finding user in database " + error)
    );
  }

  try {
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(createHttpError(400, "Invalid Credentials"));
    }
  } catch (error) {
    return next(
      createHttpError(
        500,
        "Error in matching user creadentials in  database " + error
      )
    );
  }

  try {
    const accessToken = jwt.sign(
      { sub: user._id },
      config.jwtSecret as string,
      {
        expiresIn: "2d",
      }
    );

    res
      .status(200)
      .json({ message: "Successfully logged in", user: user._id, accessToken });
  } catch (error) {
    return next(createHttpError(500, "Error in signing access token " + error));
  }
};

export { registerUser, loginUser };
