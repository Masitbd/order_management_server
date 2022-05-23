const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cli = require("nodemon/lib/cli");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzwqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  const itemConnection = client.db("electrix").collection("items");

  // get data

  app.get("/item", async (req, res) => {
    const query = {};
    const cursor = itemConnection.find(query);
    const items = await cursor.toArray();
    res.send(items);
  });
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello ElectriX");
});

app.listen(port, () => {
  console.log(`Electrix application run on port ${port}`);
});
