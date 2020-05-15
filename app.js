const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const got = require("got");
const dotenv = require("dotenv");
var FormData = require('form-data');
var fs = require('fs');
var http = require('http');
var request = require('request');


dotenv.config();
const port = 3000;
const app = express();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let refresh_token = process.env.REFRESH_TOKEN;
let access_token = process.env.ACCESS_TOKEN;

app.use(bodyParser.json());
app.use(cors());

const getApplication = async (req, res) => {
  try {
    // https://msp-phac.smapply.io/api/applications/
    // 107437110 17806957
    const result = await got.get("https://msp-phac.smapply.io/api/applications/17806957/tasks/", {
      responseType: 'json',
      // curl -H "Authorization: Bearer <ACCESS_TOKEN>" <YOUR_SITE>/api/
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })
    const body = result.body;
    res.json(body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

const refreshTokens = async (req, res) => {
  try {
    console.log(`old refresh token: ${refresh_token}`);
    console.log(`old access token: ${access_token}`);
    var options = {
      'method': 'POST',
      'url': 'https://msp-phac.smapply.io/api/o/token/',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'sessionid=oawurvgmdftc04g2593mtsjahdaigyn5'
      },
      form: {
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
      }
    };
    request(options, function (error, response) { 
      if (error) throw new Error(error);
      const data = JSON.parse(response.body);
      console.log(`new refresh token: ${data.refresh_token}`);
      console.log(`new access token: ${data.access_token}`);

      refresh_token = data.refresh_token;
      access_token = data.access_token;

      const envData = `CLIENT_ID=${client_id}\nCLIENT_SECRET=${client_secret}\nREFRESH_TOKEN=${refresh_token}\nACCESS_TOKEN=${access_token}` 
      fs.writeFile('.env', envData, (err) => {
        if (err) throw err;
        console.log('.env variables changed!');
      });
      res.json(data)
    });
    // explicitly reassign tokens to .evn counterparts after making POST request
    refresh_token = process.env.REFRESH_TOKEN;
    access_token = process.env.ACCESS_TOKEN;
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

app.get("/api_application", getApplication);
app.get("/api_refresh", refreshTokens);
app.use(express.static("public"));  //make available to browser these files without additional request
app.get("/*", (req, res) => {       //all other routes - default route
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => { // start app
  console.log(`Listening on port ${port}`);
});
