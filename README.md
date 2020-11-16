# True Shuffle
#### I made this web application to have the ability to and play and shuffle several Spotify playlists.  I have also noticed strange behavior in Spotify's traditional shuffle method that I wanted to fix. I am using the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) and all client side for the application. You can run this application by downloading this repo and performing the steps below.
1. [Get a client ID by creating an app on Spotify](https://developer.spotify.com/dashboard/applications)
2. [Download Docker](https://www.docker.com/get-started)
3. In this downloaded repo change `code/src/secrets.js` with the new client ID from the Spotify dashboard.
4. Run `docker-compose build` and then `docker-compose up` in the repo root directory to start the webserver.
After this the web app will be running and you can login with your Spotify account.
