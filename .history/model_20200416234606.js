const uuidv4 = require('uuid/v4');

// The Session class gets instantiated only once by the server. A session object holds collections of all the games and all the players of the current server's session
class Session {
  constructor() {
    let players = [];
    let games = [];
    let openGames = [];
    this.addPlayer = function (player) {
      players.push(player);
    }
    this.nameTaken = function (name, id) {
      let temp;
      for (let i = 0; i < players.length; i++) {
        if (players[i].getName() == name) {
          return true;
        }
        if (players[i].getId() == id) {
          temp = i;
        }
      }
      players[temp].setName(name);
      return false;
    },
      this.getGames = function () {
        return games;
      }
    this.getGame = function (gameId) {
      return games.find(game => game.getId() == gameId);
    }
    this.updateGames = function (game) {
      games.push(game);
    }
    this.getOpenGames = function () {
      return openGames;
    }
    this.updateOpenGames = function (gameId) {
      openGames.push(gameId);
    }
    this.getPlayer = function (playerId) {
      return players.find(player => player.getId() == playerId)
    }
  }
};
// The Game class is used to create games that store all necessary information about one game and provide all the relevant methods
class Game {
  // Closure is used over the constructor so that an object's properties are only accessible by the object's methods
  constructor(playerno, boardHeight, boardWidth) {
    //numberOfPlayers sets the number of players that can take part in a game, currently hard-coded to 2, could be set by the game's initiator
    let numberOfPlayers = playerno;

    this.getNumberOfPlayers = function () {
      return numberOfPlayers;
    }
    //every game gets a unique id
    let id = uuidv4();
    this.getId = function () {
      return id;
    }
    //stores a game's players
    let players = [];
    this.getPlayers = function () {
      return players;
    }
    let gameDone = false;
    //adds a player to a game
    this.addPlayer = function (playerId, playerName, openGames) {
      players.push({ id: playerId, gems: 0, outcome: "lost", name: playerName });
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
    this.getPlayerTurn = function (playerId) {
      if (!gameDone) {
        if (playerId == playerTurn) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        let outcomes = [];
        for (i = 0; i < players.length; i++) {
          outcomes.push({ id: players[i].id.slice(-5), outcome: players[i].outcome, name: players[i].name, gems: players[i].gems });
        }
        return outcomes;
      }
    }
    this.setPlayerTurn = function (playerId) {
      playerTurn = playerId
    }

    //makeMove is now in charge of determining what happens when a player clicks on an alarm
    this.makeMove = function (playerId, playerName, currRow, currCol) {
      //check if the player is authorised to make a move, meaning that it is his turn in fact
      if (!this.getPlayerTurn(playerId)) {
        return [currState, 2];
      }
      //check if the move is valid at all - i.e. that an alarm is present on the board at that specific location
      if (currState[currRow][currCol].type !== "alarm" || currState[currRow][currCol].state == false) {
        return [currState, 3];
      }
      let gemsFound = [];
      currState[currRow][currCol].state = (false);

      //Temporary variables to hold surrounding cells
      let leftCell;
      let rightCell;
      let upCell;
      let downCell;

      let alarmsAroundGemsFound = [];

      //Check if surrounding are gems
      if (currRow - 1 >= 0) {
        upCell = currState[currRow - 1][currCol];
        if (upCell.type == "gem") {
          gemsFound.push(upCell);
        }
      }
      if (currCol - 1 >= 0) {
        leftCell = currState[currRow][currCol - 1];
        if (leftCell.type == "gem") {
          gemsFound.push(leftCell);
        }
      }
      if (currRow < height - 1) {
        downCell = currState[parseInt(currRow) + 1][currCol];
        if (downCell.type == "gem") {
          gemsFound.push(downCell);
        }
      }
      if (currCol < width - 1) {
        rightCell = currState[currRow][parseInt(currCol) + 1];
        if (rightCell.type == "gem") {
          gemsFound.push(rightCell);
        }
      }


      //loop 2 - check for alarms around each gem to see if gem should be captured
      //empty array or create new array for each gem

      for (let i = 0; i < gemsFound.length; i++) {
        let gemRow = gemsFound[i].row; //new GemRow
        let gemCol = gemsFound[i].col; //new GemCol
        upCell = (currState[gemRow - 1][gemCol]);
        if (upCell.type == "alarm" && upCell.state == true) {
          alarmsAroundGemsFound.push(upCell);
        }
        leftCell = (currState[gemRow][gemCol - 1]);
        if (leftCell.type == "alarm" && leftCell.state == true) {
          alarmsAroundGemsFound.push(leftCell);
        }
        downCell = currState[parseInt(gemRow) + 1][gemCol];
        if (downCell.type == "alarm" && downCell.state == true) {
          alarmsAroundGemsFound.push(downCell);
        }
        rightCell = (currState[gemRow][parseInt(gemCol) + 1]);
        if (rightCell.type == "alarm" && rightCell.state == true) {
          alarmsAroundGemsFound.push(rightCell);
        }

        //if the array is empty after removing all surrounding gems
        //this means a gem's final alarm has been disabled
        //the player gets to make another move
        if (alarmsAroundGemsFound.length == 0) {
          currState[gemRow][gemCol].state = false;
          currState[gemRow][gemCol].name = playerName;
          let index = players.findIndex(player => player.id == playerId);
          players[index].gems++;
          alarmsAroundGemsFound = [];

          if (this.checkForWin(playerId, boardHeight, boardWidth)) {
            gameDone = true;
            let outcomes = [];
            for (i = 0; i < players.length; i++) {
              outcomes.push({ id: players[i].id.slice(-5), outcome: players[i].outcome, name: players[i].name, gems: players[i].gems });
            }
            return [currState, 4, outcomes]; //case switch 4
          }
          else {
            return [currState, 1]; //case switch 1
          }
        }
        //the alarm disabled was not the final one
        else {
          //determines whose turn it is next
          let index = players.findIndex(player => player.id == playerId);
          if (index == players.length - 1) {
            index = 0;
          }
          else {
            index = index + 1;
          }
          this.setPlayerTurn(players[index].id);
          alarmsAroundGemsFound = [];
          return [currState, 0];
        }


      }
    }

    let height = boardHeight;
    let width = boardWidth;
    // stores the board's state
    let currState = [];
    //initializes board state
    for (var i = 0; i < height; i++) {
      currState[i] = [];
      for (var j = 0; j < width; j++) {
        //currState[i].push(true); //default all true
        if (i % 2 && j % 2) {
          currState[i].push({
            state: true,
            row: i,
            col: j,
            type: "gem"
          })
        }
        else if (j % 2 || i % 2) {
          currState[i].push({
            state: true,
            row: i,
            col: j,
            type: "alarm"
          })
        }
        else {
          currState[i].push({
            state: true,
            row: i,
            col: j,
            type: "empty"
          })
        }
      }
    }
    this.getBoard = function () {
      return currState;
    }
    this.checkForWin = function (playerId, boardHeight, boardWidth) {

      let noGems = (Math.floor(boardHeight / 2)) * (Math.floor(boardWidth / 2));
      let gemsToWin = Math.floor((noGems / 2) + 1);
      let gemsToDraw = (noGems / players.length);
      let index = players.findIndex(player => player.id == playerId);

      //figure out total number of gems captured
      let gemsCaptured = 0;
      for (i = 0; i < players.length; i++) {
        gemsCaptured = + players[i].gems;
      }

      //declare winner
      if (players[index].gems == gemsToWin) {
        players[index].outcome = "won";
        return true;
      }
      //if players have not yet reached gemsToWin (check their score)
      else {
        //if all gems are captured check who has drawn
        if (gemsCaptured == noGems) {
          let max = 0; //highest gems by any player
          let temp = []; 
          for (let i = 0; i < players.length; i++) {
            if (players[i].gems >= max) {
              max = players[i].gems;
            }
          }
          //check what players match the maximum obtained score by players
          for (let j = 1; j < players.length; j++) {
            if (players[j].gems == max) {
              temp.push[players[j].id];
              //if at least 2 match this score --> declare a draw
              if (temp.length >= 2) {
                for (let k = 0; temp.length; k++) {
                  let index = players.findIndex(player => player.id == temp[k]);
                  players[index].outcome = "drawn";
                  return true;
                }
              }
              else {
                players[j].outcome = "won";
                return true;
              }
            }
          }
        }
      }
      
    }
  }
};

//class Player at the moment only provides a player object with a player id
class Player {
  constructor() {
    let id = uuidv4();
    this.getId = function () {
      return id;
    }
    let name = "";
    this.getName = function () {
      return name;
    }
    this.setName = function (newName) {
      name = newName;
    }
    let score = {
      win: 0,
      draw: 0,
      loss: 0
    };
    this.getScore = function () {
      return score;
    }
    this.updateScore = function (dimension) {
      score.dimension++;
    }
  }
};

//needed to make the classes available to other node modules.
module.exports = {
  Session: Session,
  Game: Game,
  Player: Player
};