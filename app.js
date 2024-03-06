const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetsRoutes");

if (process.env.ENVIRONMENT === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);

app.use(globalErrorHandler);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Couldn't find the following path ${req.originalUrl}`,
  });
});

module.exports = app;
