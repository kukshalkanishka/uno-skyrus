const { Game } = require('./../models/game');
const { Players } = require('./../models/players');
const { ActivityLog } = require('./../models/activityLog');
const { parseCards, parsePlayer } = require('./../utils/util');

class Games {
  constructor() {
    this.games = [];
  }

  addGame(game) {
    this.games.push(game);
  }

  doesGameExist(gameKey) {
    return this.games.some(game => game.getKey() == gameKey);
  }

  getGame(gameKey) {
    return this.games.find(game => game.getKey() == gameKey);
  }
  saveGame(writeData, gameKey) {
    writeData(gameKey, this.getGame(gameKey));
  }

  loadGame(gameKey, gameData) {
    const deck = parseCards(gameData.deck);
    const playersData = gameData.players;
    const host = parsePlayer(playersData.host);
    const players = new Players(
      host,
      playersData.currentPlayerIndex,
      playersData.turnDirection
    );
    const allPlayers = playersData.players.map(player => parsePlayer(player));
    allPlayers[0] = host;
    players.setPlayers(allPlayers);
    players.setCurrentPlayer();
    const lastPlayer = players.getPlayer(playersData.lastPlayer.id);
    players.loadData(lastPlayer);

    const activityLog = new ActivityLog(gameData.logs);

    const game = new Game(
      deck,
      playersData.players.length,
      gameKey,
      players,
      activityLog,
      gameData.saveStatus
    );
    game.loadData(
      parseCards(gameData.stack),
      parseCards(gameData.pile),
      gameData.status,
      gameData.runningColor,
      gameData.cardsToDraw,
      gameData.hasDrawnTwo
    );
    game.setNumberOfPlayersJoined(gameData.numberOfPlayersJoined);
    if (!this.doesGameExist(gameKey)) {
      this.addGame(game);
    }
  }
}

module.exports = { Games };
