const SpotifyWebApi = require('spotify-web-api-node');

function updateAccessToken(req, res, next) {
  // Spotify API Setup
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
      next(err);
    })
}

module.exports = updateAccessToken;