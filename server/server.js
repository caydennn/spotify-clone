require("dotenv").config({path: __dirname +'/.env'})
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require('lyrics-finder')
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Allows us to parse url parameters for get requests



app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("refresh token: " , refreshToken)
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI, 
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI, 
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});


app.get("/lyrics" , async(req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
  res.json( {lyrics })
})

app.listen(3001);
