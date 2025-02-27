const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// meddilware
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PS}@cluster0.zkgbt.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollaction = client.db("coffeeDB").collection("coffee");
    const userCollaction = client.db("coffeeDB").collection("users");

    app.get("/coffee", async (req, res) => {
      const coffee = coffeeCollaction.find();
      const result = await coffee.toArray();
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollaction.insertOne(newCoffee);
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollaction.findOne(query);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
        },
      };
      const result = await coffeeCollaction.updateOne(filter, coffee, options);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollaction.deleteOne(query);
      res.send(result);
    });

    // users releted apis

    app.get("/users", async (req, res) => {
      const users = userCollaction.find();
      const result = await users.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUsers = req.body;
      const result = await userCollaction.insertOne(newUsers);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updateDoc = {
        $set: {
          lastSignInTime: req.body?.lastSignInTime,
        },
      };
      const result = await userCollaction.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUser = req.body;
      const user = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
        },
      };
      const result = await userCollaction.updateOne(filter.user.options);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollaction.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee  make Server Is Runing ");
});

app.listen(port, () => {
  console.log(`Coffee Server is port runing: ${port}`);
});

// CoffeeServer
// w9NmZ7uMNUbnIyOj
