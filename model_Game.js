class Game {
  constructor(no, playerId) {
    let numberOfPlayers = no;
    this.getNumberOfPlayers = function() {
      return numberOfPlayers;
    }
    let id = generateID();
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
