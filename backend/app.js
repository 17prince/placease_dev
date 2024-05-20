const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// Importing Routers
const studentRouter = require("./routers/studentRoutes");
const inboxRouter = require("./routers/inboxRouter");
const companyRouter = require("./routers/companyRouter");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
// body-parser to read req.body
app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());
// ROUTERS
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/auth", inboxRouter);
app.use("/api/v1/companies", companyRouter);

//Handel all invalid endpoints
app.all("/", (req, res, next) => {
  next(
    new AppError(
      `Can not found this url ${req.originalUrl} on this server.`,
      400
    )
  );
});

// TO DIFINE GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
