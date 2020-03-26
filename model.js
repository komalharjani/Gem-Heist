const uuidv4 = require('uuid/v4');

class Session {
  constructor() {
    let players = [];
    let games = [];
    let openGames = [];
    this.addPlayer = function(playerId) {
      players.push(playerId);
    }
    this.getGames = function() {
      return games;
    }
    this.getGame = function(id) {
      return games.find(game => game.getId() == id);
    }
    this.updateGames = function(game) {
      games.push(game);
    }
    this.getOpenGames = function() {
      return openGames;
    }
    this.updateOpenGames = function(gameId) {
      openGames.push(gameId);
    }
  }
};
class Game {
  constructor() {
    let numberOfPlayers = 2;
    this.getNumberOfPlayers = function() {
      return numberOfPlayers;
    }
    let id = uuidv4();
    this.getId = function() {
      return id;
    }
    let activePlayers = [];
    this.getActivePlayers = function() {
      return activePlayers;
    }
    this.addActivePlayer = function(playerId, openGames) {
      activePlayers.push(playerId);
      console.log("I am" + this.getId())
      if (activePlayers.length == numberOfPlayers) {
        let index = openGames.findIndex((openGame) => openGame == id);
        //model.model.getOpenGames().splice(index,1);
        //console.log("no of players"+activePlayers.length + "/"+numberOfPlayers + model.openGames);
        this.setPlayerTurn(playerId);
        return index;
      } else {
        return -1;
      }
    }
    let playerTurn;
    this.getPlayerTurn = function(playerId) {
      if (playerId == playerTurn) {
        return true;
      }
      else{
        return false;
      }
    }
    this.setPlayerTurn = function(playerId) {
      playerTurn = playerId
    }
    this.makeMove = function(playerId){
      let index = activePlayers.findIndex(player => player == playerId);
      if (index==activePlayers.length-1){
        index=0;
      }
      else{
        index++;
      }
      this.setPlayerTurn(activePlayers[index]);
    }
  }
};
class Player {
  constructor() {
    let id = uuidv4();
    this.getId = function() {
      return id;
    }
  }
};
module.exports = {
  Session: Session,
  Game: Game,
  Player: Player
};
