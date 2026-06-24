const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API Running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});