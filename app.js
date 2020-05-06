const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const got = require("got");
const dotenv = require("dotenv");

dotenv.config();
const port = 3000;
const app = express();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;

app.use(bodyParser.json());
app.use(cors());

const exampleFunc = async (req, res) => {
  try {
    const { body } = await got.post("https://msp-phac.smapply.io/", {
      json: {
        grant_type: "refresh_token",
        client_id,
        client_secret,
        refresh_token,
      },
      responseType: "json",
    });

    console.log(body);
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

app.get("/api", exampleFunc);
app.use(express.static("public"));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
