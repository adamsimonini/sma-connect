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
let refresh_token = process.env.REFRESH_TOKEN;
let access_token = process.env.ACCESS_TOKEN;

app.use(bodyParser.json());
app.use(cors());

const authorize = async (req, res) => {
  try {
    const result = await got.get("https://msp-phac.smapply.io/api/tasks/", {
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })
    const body = result.body;

    console.log(body);
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

// curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
const exampleFunc = async (req, res) => {
  try {
    const result = await got.post("https://msp-phac.smapply.io/api/o/token/", {
      json: {
        grant_type: "refresh_token",
        client_id,
        client_secret,
        refresh_token,
      },
      responseType: "json",
    });
    const body = result.body;

    console.log(body);
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

app.get("/api_auth", authorize);
app.get("/api", exampleFunc);
app.use(express.static("public"));  //make available to browser these files without additional request
app.get("/*", (req, res) => {       //all other routes - default route
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => { // start app
  console.log(`Listening on port ${port}`);
});
