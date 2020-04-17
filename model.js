const uuidv4 = require('uuid/v4');

/**
 * The Session class gets instantiated only once by the server. A session object holds collections of all the games and all the players of the current server's session
 */
class Session {
  // Closure is used over the constructor so that an object's properties are only accessible by the object's methods
  constructor() {
    let players = [];
    let games = [];
    // to keep track of games that have not been started yet
    let openGames = [];
    //Adds a player to the session's list of players
    this.addPlayer = function (player) {
      players.push(player);
    }
    //finds and returns a particular player by its id
    this.getPlayer = function (playerId) {
      return players.find(player => player.getId() == playerId)
    }
    // this function iterates through all the session's players to see if a name has already been used
    // if not update that player's object with the new name
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
    }
    // returns all of a sessions's games
    this.getGames = function () {
      return games;
    }
    // finds an returns a particular game by its id
    this.getGame = function (gameId) {
      return games.find(game => game.getId() == gameId);
    }
    // adds a new game to a session's games
    this.updateGames = function (game) {
      games.push(game);
    }
    // returns all the games that have not been started yet
    this.getOpenGames = function () {
      return openGames;
    }
    // adds a new game to the array of the games that have not been started
    this.updateOpenGames = function (gameId) {
      openGames.push(gameId);
      console.log("new game added" + openGames);
    }

  }
};
/**
 * The Game class is used to create games that store all necessary information about one game and provide all the relevant methods
 */
class Game {
  // Closure is used over the constructor so that an object's properties are only accessible by the object's methods
  constructor(playerno, boardHeight, boardWidth) {
    // store dimensions of board
    let height = boardHeight;
    let width = boardWidth;
    //Number of Gems in Total
    let noGems = (Math.floor(boardHeight / 2)) * (Math.floor(boardWidth / 2));
    // stores the board's state
    let currState = [];
    // returns the current state of the board
    this.getBoard = function () {
      return currState;
    }
    //initializes board state -> fills array with properties of each cell in the table
    for (var i = 0; i < height; i++) {
      currState[i] = [];
      for (var j = 0; j < width; j++) {
        //Gems
        if (i % 2 && j % 2) {
          currState[i].push({
            state: true,
            row: i,
            col: j,
            type: "gem"
          })
        }
        //Alarms
        else if (j % 2 || i % 2) {
          currState[i].push({
            state: true,
            row: i,
            col: j,
            type: "alarm"
          })
        }
        //Empty Cells
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
    //numberOfPlayers sets the number of players that can take part in a game
    let numberOfPlayers = playerno;
    // returns the number of players that was set for this game
    this.getNumberOfPlayers = function () {
      return numberOfPlayers;
    }
    //every game gets a unique id
    let id = uuidv4();
    //returns a game's id
    this.getId = function () {
      return id;
    }
    //stores a game's players
    let players = [];
    //returns a game's players
    this.getPlayers = function () {
      return players;
    }
    // flag variable set once a game is finnished
    let gameDone = false;
    this.getGameDone = function () {
      return gameDone;
    }
    //adds a player to a game
    this.addPlayer = function (playerId, playerName, openGames) {
      // notice: the default game's outcome is set to loss for every player, this is then only updated if a player wins or draws
      players.push({ id: playerId, gems: 0, outcome: "loss", name: playerName });
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
    //playerTurn is used to store whose turn it is. This is achieved by simply storing a player's id.
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
      // if the game is over the turn does not need to be updated any more. Instead the outcome for each player is recorded in an array and returned
      else {
        let outcomes = [];
        for (i = 0; i < players.length; i++) {
          outcomes.push({ id: players[i].id, outcome: players[i].outcome, name: players[i].name, gems: players[i].gems });
        }
        return outcomes;
      }
    }
    this.setPlayerTurn = function (playerId) {
      playerTurn = playerId
    }

    /**
     * makeMove is in charge of determining what happens when a player clicks on an alarm
     * and determines whether to capture a gem
     */
    this.makeMove = function (playerId, playerName, currRow, currCol) {
      let index = players.findIndex(player => player.id == playerId);
      //check if the player is authorised to make a move, meaning that it is his turn in fact
      if (!this.getPlayerTurn(playerId)) {
        return [currState, 2];
      }
      //check if the move is valid at all - i.e. that an alarm is present on the board at that specific location
      if (currState[currRow][currCol].type !== "alarm" || currState[currRow][currCol].state == false || gameDone == true) {
        return [currState, 3];
      }
      let gemsFound = [];
      //remove the alarm - set the state at that particular set of coordinates to false
      currState[currRow][currCol].state = (false);

      //Temporary variables to hold surrounding cells
      let leftCell;
      let rightCell;
      let upCell;
      let downCell;
      let alarmsAroundGemsFound = [];

      //Check if surrounding are gems - if yes push into the GemsFound array
      if (currRow - 1 >= 0) {
        upCell = currState[parseInt(currRow) - 1][currCol];
        if (upCell.type == "gem") {
          gemsFound.push(upCell);
        }
      }
      if (currCol - 1 >= 0) {
        leftCell = currState[currRow][parseInt(currCol) - 1];
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
      let gemCollected = false;

      //check for alarms around each gem to see if gem found to determine if it should be captured
      // 
      for (let i = 0; i < gemsFound.length; i++) {
        //assigns the row and column of gemFounds[i]
        let gemRow = gemsFound[i].row;
        let gemCol = gemsFound[i].col;

        //Finds alarms around the gem and checks whether they are true
        upCell = (currState[parseInt(gemRow) - 1][gemCol]);
        if (upCell.type == "alarm" && upCell.state == true) {
          alarmsAroundGemsFound.push(upCell);
        }
        leftCell = (currState[gemRow][parseInt(gemCol) - 1]);
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
          //set the state of the gem found to false, insert the player's name (if present)
          currState[gemRow][gemCol].state = false;
          currState[gemRow][gemCol].name = playerName;

          //increase that player's gem count 
          players[index].gems++;
          gemCollected = true;
        }
        alarmsAroundGemsFound = [];
      }
      //the alarm disabled was not the final one

      if (!gemCollected) {
        //determines whose turn it is next
        if (index == players.length - 1) {
          index = 0;
        }
        else {
          index = index + 1;
        }
        this.setPlayerTurn(players[index].id);

        return [currState, 0];
      }
      else {
        // check if the game is over now, if yes record all the player's outcome for that particular game in an array and return it along with the updated board
        if (this.checkForWin(playerId, boardHeight, boardWidth)) {
          gameDone = true;
          let outcomes = [];
          for (i = 0; i < players.length; i++) {
            outcomes.push({ id: players[i].id, outcome: players[i].outcome, name: players[i].name, gems: players[i].gems });
          }
          return [currState, 4, outcomes, players[index].gems];
        }
        else {
          return [currState, 1, players[index].gems];
        }
      }
    }
    /**
      * This function checks whether a player has won or drawn
      */
    this.checkForWin = function (playerId, boardHeight, boardWidth) {

      
      //Number of gems required to win
      let gemsToWin = Math.floor((noGems / 2) + 1);
      //Function to find each player's count of gems
      let index = players.findIndex(player => player.id == playerId);
      let gemsCaptured = 0;

      //Find how many gems are captured in total
      for (i = 0; i < players.length; i++) {
        gemsCaptured = gemsCaptured + players[i].gems;
      }

      //If a player's gems equals to the gems required to win - declare winner
      if (players[index].gems == gemsToWin) {
        players[index].outcome = "win";
        return true;
      }
      else {
        //if all gems are captured in the game check who has drawn
        if (gemsCaptured == noGems) {
          let max = 0;
          let temp = [];
          //Find the highest score among players
          for (let i = 0; i < players.length; i++) {
            if (players[i].gems >= max) {
              max = players[i].gems;
            }
          }
          //check what players have this score
          for (let j = 0; j < players.length; j++) {
            if (players[j].gems == max) {
              temp.push(players[j].id);
            }
          }
          //If at least 2 players have this score declare those as a draw
          if (temp.length >= 2) {
            for (let k = 0; players.length; k++) {
              for (let m = 0; m < temp.length; m++) {
                let index = players.findIndex(player => player.id == temp[m]);
                players[index].outcome = "draw";
              }
              return true;
            }
          }
          //Else declare a single winner when the game has finished
          else {
            players[j].outcome = "win";
            return true;
          }
        }
      }
    }
    this.leaveGame = function (playerId) {
      let index = players.findIndex(player => player.id == playerId);
      let outcomes = [];
      if (numberOfPlayers == 2) {
        gameDone = true;
        index = +!index;
        players[index].outcome = "win";
        
        for (i = 0; i < players.length; i++) {
          outcomes.push({ id: players[i].id, outcome: players[i].outcome, name: players[i].name, gems: players[i].gems });
        }
        return [currState, 4, outcomes, players[index].gems];
      }
      else {
        let newIndex;
        //determines whose turn it is next
        if (index == players.length - 1) {
          newIndex = 0;
        }
        else {
          newIndex = index + 1;
        }
        this.setPlayerTurn(players[newIndex].id);
        noGems=noGems-players[index].gems;
        outcomes.push({ id: players[index].id, outcome:players[index].outcome, name: players[index].name, gems: players[index].gems });
        players.splice(index, 1);
        for (i = 0; i < players.length; i++) {
          outcomes.push({ id: players[i].id, outcome:"Still playing", name: players[i].name, gems: players[i].gems });
        }
        return [currState, 4,outcomes,outcomes[0].gems];
      }
    }
  }
};

//class Player
class Player {
  constructor() {
    //store and return a player's unique id
    let id = uuidv4();
    this.getId = function () {
      return id;
    }
    // stores and returns the name or an empty string if not set
    let name = "";
    this.getName = function () {
      return name;
    }
    this.setName = function (newName) {
      name = newName;
    }
    // that player's statistics are stored, retreived and updated (after each game)
    let score = {
      win: 0,
      draw: 0,
      loss: 0
    };
    this.getScore = function () {
      return score;
    }
    this.updateScore = function (dimension) {
      switch (dimension) {
        case "win":
          score.win++;
          break;
        case "draw":
          score.draw++;
          break;
        case "loss":
          score.loss++;
      }

    }
  }
};

//needed to make the classes available to other node modules.
module.exports = {
  Session: Session,
  Game: Game,
  Player: Player
};