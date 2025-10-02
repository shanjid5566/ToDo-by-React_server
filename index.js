const express = require("express");
const cors = require("cors");
const port = process.env.port | 4000;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello from home page");
});

app.listen(port, () => {
  console.log(`server on port ${port}`);
});
