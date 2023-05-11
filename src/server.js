import express from "express";
import mainRoutes from "./routes/main.route";
import APIRoutes from "./routes/userAPI.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import cors from "cors";
import mongoose from "mongoose";
import { generateToken, verifyJWT } from "./utils/auth.utils";

require("dotenv").config();

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

// mongoose.connect(process.env.MONGODB_URL);

configViewEngine(app);
app.use("/", mainRoutes);
app.use("/v1/api", APIRoutes);

connectDB();
const port = process.env.PORT || 2619;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
