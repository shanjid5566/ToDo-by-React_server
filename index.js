const express = require("express");
const cors = require("cors");
const port = process.env.port | 4000;
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Pass}@shanjid.wxj1xep.mongodb.net/?retryWrites=true&w=majority&appName=shanjid`;

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
    const myDB = client.db("Todo");
    const todoCollections = myDB.collection("list");

    // Get all tasks from db

    app.get("/todos", async (req, res) => {
      try {
        const cursor = await todoCollections.find().toArray();
        console.log(cursor);
        res.send(cursor);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Something went wrong" });
      }
    });
    // save tasks in db
    app.post("/todos", async (req, res) => {
      const data = req.body;
      const result = await todoCollections.insertOne(data);
      res.send(result);
    });
    app.patch("/todos/:taskId", async (req, res) => {
      const id = req.params.taskId;
      const query = { _id: new ObjectId(id) };
      const { status } = req.body; // front-end থেকে নতুন status পাঠাও

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: status }, // এখানে status আপডেট হচ্ছে
        };

        const result = await todoCollections.updateOne(query, updateDoc);

        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "No task updated" });
        }

        // আপডেট হওয়া ডকুমেন্ট আবার fetch করতে চাইলে
        const updatedTask = await todoCollections.findOne(query);

        res.send(updatedTask);
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
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
  res.send("Hello from home page");
});

app.listen(port, () => {
  console.log(`server on port ${port}`);
});
