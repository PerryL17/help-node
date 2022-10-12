require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const path = require("path");
const port = process.env.PORT || 5000;

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
//security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(xss());
//Cross Origin Resources Sharing
const whiteList = ["http://localhost:3000", "http://localhost:5000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors());
//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
//routers
const authRouter = require("./routes/auth");
const listsRouter = require("./routes/lists");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
//const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// routes
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/lists", authenticateUser, listsRouter);

app.use(notFoundMiddleware);
//app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
