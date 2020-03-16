const uuidv4 = require('uuid/v4');
var exports = module.exports={};
exports.model={
  players:[],
  games:[],
  Game:class {
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
      activePlayers.push();
      this.getActivePlayers = function() {
        return activePlayers;
      }
      this.addActivePlayer = function(playerId) {
        if (activePlayers.length < this.getNumberOfPlayers()) {
          activePlayers.push(playerId);
          return true;
        } else {
          return false;
        }
      }
      let playerTurn;
      this.getPlayerTurn = function() {
        return playerTurn;
      }
    }
  },
  Player:class {
    constructor(){
      let id = uuidv4();
      this.getId = function() {
        return id;
      }
    }
  }
}
