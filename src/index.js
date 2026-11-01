import path from "path";
import express from "express";
import router from "./route/route.js";
import errorHandler from "./middleware/errorHandler.js";
import { NotFoundError } from "./core/error.response.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import classRouter from "./route/class.route.js";
import lessonRouter from "./route/lesson.route.js";
const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/", router);
app.use("/api/v1", lessonRouter);
app.use("/api/v1/classes", classRouter);

app.use((req, res, next) => {
  next(new NotFoundError(`Resource ${req.originalUrl} not found`));
});

app.use(errorHandler);

const startServer = async () => {
  // Check and initialize DB connection
  await connectDB();

  app.listen(config.app.port, () => {
    console.log(
      `Server is running on port http://localhost:${config.app.port}`,
    );
  });
};

startServer();
