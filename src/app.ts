import express, { NextFunction, Request, Response } from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";

const app = express();

app.get("/", (req, res) => {
  const err = createHttpError("error");
  throw err;
  res.json({ message: "First Route" });
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
export default app;
