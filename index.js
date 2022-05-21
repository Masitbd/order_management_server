const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Manufacturer Application");
});

app.listen(port, () => {
  console.log(`Manufacturer application run on port ${port}`);
});
