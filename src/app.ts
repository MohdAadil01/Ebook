import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "First Route" });
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
export default app;
