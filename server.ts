import app from "./src/app";
import { config } from "./src/config/config";
import { connectDB } from "./src/config/connectDB";

connectDB();

app.listen(config.port || 3000, () => {
  console.log("Server Started on " + config.port);
});
