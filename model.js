const uuidv4 = require('uuid/v4');

// The Session class gets instantiated only once by the server. A session object holds collections of all the games and all the players of the current server's session
class Session {
  constructor() {
    let players = [];
    let games = [];
    let openGames = [];
    this.addPlayer = function(player) {
      players.push(player);
    }
    this.nameTaken = function(name,id){
      let temp;
      for (let i=0;i<players.length;i++){
        if (players[i].getName()==name){
          console.log("match");
          return true;
        }
        if (players[i].getId()==id){
          temp = i;
        }
      }
      players[temp].setName(name);
      return false;
    },
    this.getGames = function() {
      return games;
    }
    this.getGame = function(gameId) {
      return games.find(game => game.getId() == gameId);
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
// The Game class is used to create games that store all necessary information about one game and provide all the relevant methods
class Game {
  // Closure is used over the constructor so that an object's properties are only accessible by the object's methods
  constructor(players) {
    //numberOfPlayers sets the number of players that can take part in a game, currently hard-coded to 2, could be set by the game's initiator
    let numberOfPlayers = players;
    this.getNumberOfPlayers = function() {
      return numberOfPlayers;
    }
    //every game gets a unique id
    let id = uuidv4();
    this.getId = function() {
      return id;
    }
    //stores a game's players
    let players = [];
    this.getPlayers = function() {
      return players;
    }
    //adds a player to a game
    this.addPlayer = function(playerId, openGames) {
      players.push(playerId);
      //Every time a player gets added, check if the necessary number of players has been reached so that the game can start
      //In this case the first turn is set to the player that was just added
      if (players.length == numberOfPlayers) {
        let index = openGames.findIndex((openGame) => openGame == id);
        this.setPlayerTurn(playerId);
        return index;
      } else {
        return -1;
      }
    }
    //playerTurn is used to store whose turn it is. This is achieved by simply storing the player's turn.
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
    //makeMove is only setup in a preliminary way. Right now it only passes  the turn to the next player in line. It could however also be used to update the board
    this.makeMove = function(playerId){
      let index = players.findIndex(player => player == playerId);
      if (index==players.length-1){
        index=0;
      }
      else{
        index++;
      }
      this.setPlayerTurn(players[index]);
    }
  }
};

//class Player at the moment only provides a player object with a player id
class Player {
  constructor() {
    let id = uuidv4();
    this.getId = function() {
      return id;
    }
    let name = "";
    this.getName = function() {
      return name;
    }
    this.setName=function(newName){
      name=newName;
    }
  }
};

//needed to make the classes available to other node modules.
module.exports = {
  Session: Session,
  Game: Game,
  Player: Player
};
