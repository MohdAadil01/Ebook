import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoute from "./routes/userRoutes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "First Route" });
});

app.use("/api/users", userRoute);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
export default app;
