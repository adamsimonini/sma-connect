const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const got = require("got");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

const exampleFunc = async (req, res) => {
  try {
    const { body } = await got.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        json: {
          title: "foo",
          body: "bar",
          userId: 1,
        },
        responseType: "json",
      }
    );

    console.log(body);
    res.json(body);
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.get("/api", exampleFunc);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
