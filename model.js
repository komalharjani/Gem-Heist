const uuidv4 = require('uuid/v4');
let exports = module.exports={};
exports.model={
  players:[],
  games:[],
  getGames: function(){
    return this.games;
  },
  getGame: function(id){
    return this.games.find(game=>game.getId()==id)
  },
  updateGames:function(game){
    this.games.push(game);
  },
  openGames:[],
  getOpenGames: function(){
    return this.openGames;
  },
  updateOpenGames:function(gameId){
    this.openGames.push(gameId);
  },
  Game:class {
    constructor() {
      let numberOfPlayers = 2;
      this.getNumberOfPlayers = function() {
        return numberOfPlayers;
      }
      this.enoughPlayers = function(){
        if (this.getActivePlayers.length==this.getNumberOfPlayers){
          let index = model.openGames.findIndex(id=>id==this.getId());
          model.openGames.splice(index,1);
        }
      }
      let id = uuidv4();
      this.getId = function() {
        return id;
      }
      let activePlayers = [];
      this.getActivePlayers = function() {
        return activePlayers;
      }
      this.addActivePlayer = function(playerId,openGames) {
        activePlayers.push(playerId);
        console.log("I am" + this.getId())
        if (activePlayers.length==numberOfPlayers){
          let index = openGames.findIndex((openGame)=>openGame==id);
          //model.model.getOpenGames().splice(index,1);
          //console.log("no of players"+activePlayers.length + "/"+numberOfPlayers + model.openGames);
          return index;
        }
        else{
          return -1;
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
