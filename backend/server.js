const dotenv = require("dotenv");
const path = require("node:path");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception, Shutting down....");
  console.log(err.name, err.message);

  process.exit(1);
});

// Configure the environment variables
dotenv.config({ path: path.join(__dirname, "config.env") });

// Datebase URI string
const DB = process.env.DATABASE.replace(
  /<PASSWORD>/,
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    autoCreate: true,
  })
  .then(() => {
    console.log("Datebase Connected");
  })
  .catch((err) => {
    console.log(`Can not connect to the database : ${err}`);
  });

const app = require("./app");
// Port setup
const PORT = process.env.PORT || 2548;

// Listening at the port
app.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}`);
});

// UNHANDLE RECJECTION
process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection, Shutting down.....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
