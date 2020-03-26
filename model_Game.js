class Game {
  constructor() {
    let numberOfPlayers = 2;
    this.getNumberOfPlayers = function() {
      return numberOfPlayers;
    }
    let id = uid();
    this.getId = function() {
      return id;
    }
    let activePlayers = [];
    activePlayers.push(playerId);
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
}
