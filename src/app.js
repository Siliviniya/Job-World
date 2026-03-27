require("dotenv").config();

const express = require("express");
const app = express();

// packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// database
const connectDB = require("./config/connect.config");

// routers
const authRouter = require("./routes/auth.routes");
const verifyRouter = require("./routes/verify.routes");
const jobRouter = require("./routes/job.routes");
const profileRouter = require("./routes/profile.routes");
const uploadRouter = require("./routes/upload.routes");

// middleware
const errorHandlerMiddleware = require("./middleware/errorHandler");

// set proxy
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);

// use middleware
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(cookieParser(process.env.SECRET_CODE));
app.use(
  fileUpload({
    useTempFiles: true,
  }),
);

app.use("/v1/auth", authRouter);
app.use("/v1/verify", verifyRouter);
app.use("/v1/job", jobRouter);
app.use("/v1/profile", profileRouter);
app.use("/v1/upload", uploadRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
