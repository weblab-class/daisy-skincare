/** Core Backend Server */

// require('dotenv').config();
const express = require("express"); // backend framework for our node npm
const path = require("path"); // provide utilities directory paths

// create a new express server
const app = express();

// allow us to make post requests
app.use(express.json());

// implement middleware for /api routes
app.use("/api", require("./api"));

// server for images
app.use("/images", express.static(path.join(__dirname, "images")));

// anything else falls to this "not found" case
app.all("*", (req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "Route not found" });
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

// hardcode port to 3000 for now
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
