const {
  initializePile,
  servePlayerCards,
  hostGame,
  joinGame,
  serveLobby,
  handleGame
} = require('./handlers/handleRequests');

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const { Games } = require('./models/games');
app.games = new Games();

const logRequest = function(req, res, next) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.body);
  console.log(req.cookies);
  next();
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logRequest);
app.get('/playerCards', servePlayerCards);
app.post('/hostGame', hostGame);
app.post('/joinGame', joinGame);
app.get('/pile', initializePile);
app.get('/playersStatus', handleGame);
app.get('/lobby.html', serveLobby);
app.use(express.static('public'));

module.exports = { app };
