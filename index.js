const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cli = require("nodemon/lib/cli");
const { response } = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzwqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  await client.connect();
  const itemCollection = client.db("electrix").collection("items");
  const userCollection = client.db("electrix").collection("users");

  // get data
  app.get("/item", async (req, res) => {
    const query = {};
    const cursor = itemCollection.find(query);
    const items = await cursor.toArray();
    res.send(items);
  });

  app.get("/users", async (req, res) => {
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
  });

  app.get("/item/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const item = await itemCollection.findOne(query);
    res.send(item);
  });

  app.get("/myOrder", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const myOrder = await itemCollection.find(query).toArray();
    res.send(myOrder);
  });

  app.post("/item", async (req, res) => {
    const newItem = req.body;
    const name = { name: newItem.name, email: newItem.email };
    const exists = await itemCollection.findOne(name);
    if (exists) {
      return res.send({ success: false, newItem: exists });
    }
    const result = await itemCollection.insertOne(newItem);
    return res.send({ success: true, result });
  });

  app.put("/user/:email", async (req, res) => {
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello ElectriX");
});

app.listen(port, () => {
  console.log(`Electrix application run on port ${port}`);
});
