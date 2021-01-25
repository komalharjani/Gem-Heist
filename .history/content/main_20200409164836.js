// api object with endpoints and methods for various request types.

const api = {
  endpoints: [
    "/getPlayer/",
    "/getGame/",
    "/getOpenGames/",
    "/addPlayer",
    "/getTurn",
    "/makeMove"
  ],

  get: async function (endpoint, params) {
    if (typeof (params) == "object") {
      params = "?" + params.join("&");
    }
    try {
      const getResponse = await fetch(this.endpoints[endpoint] + params);
      const json = await getResponse.json();
      return json;
    } catch (error) {
      alert("There was a problem communicating with the Gem Heist API. Error: " + error);
      console.error("There was a problem communicating with the Gem Heist API. Error: " + error);
    }
  },
  post: async function (endpoint, data) {
    try {
      const postResponse = await fetch(this.endpoints[endpoint] + parameter + endpoint + this.key, {
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
      const json = await postResponse.json();
      return json;
    } catch (error) {
      alert("There was a problem communicating with the Gem Heist API. Error: " + error);
      console.error("There was a problem communicating with the Gem Heist API. Error: " + error);
    }
  }
}

// controller object is in charge of the Gem Heist client-side and controls all the model and view updates (except the model's initial updates)

const controller = {

  //initialies everything that's required for the game's start display
  init: async function () {
    await model.init();
    view_frame.init();
    view_userStatus.init();
    view_startGame.init();
    if (controller.getOpenGames().length >= 1) {
      view_startGame.listOpenGames();
    }
  },
  //called, when a user starts a new game
  startGame: async function () {
    model.game = await api.get(1, model.player);
    view_frame.clear();
    view_game.init();
    this.createBoard();
    controller.getTurn();
  },

  //called, when a user joins an existing game
  joinGame: async function (gameId) {
    model.game = gameId;
    view_frame.clear();
    view_game.init();
    if (await api.get(3, ["gameid=" + gameId, "playerid=" + model.player])) {
      view_game.activate();
    }
    else {
      view_game.deactivate();
    }
  },

  createBoard: function () {
    const width = 7;
    var gemChar = '&#128142';
    var noGems = 12; //Hardcoded to 9 - but change to responsive
    //var noGems = document.getElementById("slider").value;
    height = (2 / 3 * noGems) + 1;

    /**
 * Declare Arrays for Drawing Board...
 */
var pieces = [];
for (var i = 0; i < height; i++) {
    pieces[i] = [];
}

/**
 * Array With Current State -- move outside function - how?
 */
var currState = [];
for (var i = 0; i < height; i++) {
    currState[i] = [];
    for (var j = 0; j < width; j++) {
        currState[i].push(true); //default all true
    }
}

var table = document.createElement("table");
for (var i = 0; i < height; i++) { //loop through height
    var row = document.createElement('tr'); //create rows for each height
    for (var j = 0; j < width; j++) { //loop through width
        var cell = document.createElement('td'); //create columns for each width
        pieces[i].push(cell);
        cell.setAttribute("row", i);
        cell.setAttribute("col", j);
        if(currState[i][j] == true) { 
        if (j % 2 && i % 2) { //identify gem cells
            //currentState[0].push(cell);
            cell.innerHTML = gemChar;
            cell.className = "gem";
            //move event listener to turn handler function
            cell.addEventListener('click', function(event){
                this.innerHTML  = "name";
                makeMove();
            })
        }
        else if (j % 2 || i % 2) { //identify alarm cells
            cell.className = "alarm";
            cell.addEventListener('click', function(event){
              this.className = "white";
                //disableAlarm();
            })
        }
    }
    else {
        cell.className = "white"
    }
        row.appendChild(cell);
    }
    table.appendChild(row);
}
document.body.appendChild(table);

//display in this div
let divContainer = document.getElementById("game");
divContainer.innerHTML = "";
divContainer.appendChild(table);
},

  //Capture Alarm Function
  disableAlarm: function() {
    this.makeMove();
      let currRow = event.target.getAttribute("row"); //curr row
      let currCol = event.target.getAttribute("col"); //curr col
      let alarmsAroundEvent = [];
      let gemsFound = [];
      let leftCell;
      let rightCell;
      let upCell;
      let downCell;
      let one = 1;
      let alarmsAroundGemsFound = [];

      currState[currRow][currCol] = (false); //bind false to cell.className = "white";
      //add move to replay

      if (currRow - 1 >= 0) {
          upCell = pieces[currRow - 1][currCol];
          alarmsAroundEvent.push(upCell);
      } if (currCol - 1 >= 0) {
          leftCell = pieces[currRow][currCol - 1];
          alarmsAroundEvent.push(leftCell);
      } if (currRow + 1 < height) {
          downCell = pieces[currRow + 1][currCol];
          alarmCheck.push(downCell);
      } if (currCol < width) {
          //     rightCell = [currRow][currCol+1];
          //     alarmCheck.push(rightCell);
      }

      console.log(upCell);
      console.log(leftCell);
      console.log(alarmsAroundEvent);
      //}

      //loop 1 find gems around alarms
      for (let i = 0; i < alarmsAroundEvent.length; i++) {
          if (alarmsAroundEvent[i].className == "gem") {
              gemsFound.push(alarmsAroundEvent[i]);
          }
      }

      //loop 2 - check for alarms around each gem to see if gem should be captured
      for (let i = 0; i < gemsFound.length; i++) {
          let gemRow = gemsFound[i].getAttribute("row");
          let gemCol = gemsFound[i].getAttribute("col");

          let alarmUp = (pieces[gemRow - 1][gemCol]);
          let alarmLeft = (pieces[gemRow][gemCol - 1]);
          //let alarmRight = (pieces[gemRow + 1][gemCol]);
          //let alarmDown = (pieces[gemRow + 1][gemCol]);

          alarmsAroundGemsFound.push(alarmUp, alarmLeft);

          for (let j = 0; j < alarmsAroundGemsFound.length; j++) {
              if (alarmsAroundGemsFound[i].className == "white") {
                  alarmsAroundGemsFound.pop[i];
              }
          }
          console.log(alarmsAroundGemsFound);

          if (alarmsAroundGemsFound.length == 0) {
              gemsFound.className = "white";
              gemsFound.innerHTML = "name";
              //add move to replay
              //currState[gemRow][gemCol] = (false);
              //model.Player.score++;
              controller.declareWinner();
          }
          else {
              //Next Turn
          }
      }
  },

  replay: function() {
    //queue
    
  },

  declareWinner: function() {
    let gemsToWin = player.length / noGems;
    if (player.score = gemsToWin) {
        //alert
        //kill game
        //update leagueboard
    }
    else {
        //next turn
    }
},

  //returns the games that are currently open to be joined
  getOpenGames: function () {
    return model.openGames;
  },


  //returns the user's id that is permanently stored in the model
  getUser: function () {
    return model.player;
  },

  //in order to know when it's one's turn the client has to constantly send requests to the api in order to check 
  getTurn: function () {
    let turnPolling = setInterval(async function () {
      let myTurn = await api.get(4, ["gameid=" + model.game, "playerid=" + model.player]);
      if (myTurn) {
        clearInterval(turnPolling);
        view_game.activate();
      }
    }, 5000);
  },

  /* this is a preliminary method that should be called when a player makes a move.
  Any board's state could be passed through this api call*/
  makeMove: async function () {
    await api.get(5, ["gameid=" + model.game, "playerid=" + model.player]);
    view_game.deactivate();
    controller.getTurn();
  }
}

// the client's model stores all the data that the client needs. This does not include information about other players ids, etc.
const model = {
  player: 0,
  game: 0,
  openGames: [],
  /* When a new client is started, it "registers" itself through the api and gets a unique id
  it will also poll all the currently open games, so that the user can join any of them*/
  init: async function () {
    this.player = await api.get(0, "");
    this.openGames = await api.get(2, "");
  }

}


//This view is in charge of displaying the game's top user status bar
const view_userStatus = {
  init: function () {
    this.userElem = document.getElementById('userName');
    //this.scoreElem = document.getElementById('score');
    this.render();
  },
  render: function () {
    this.userElem.innerHTML = 'User: ' + controller.getUser();
  }
}

//View_frame is just a container that can hold different views according to the game's stage
const view_frame = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
  },
  clear: function () {
    while (this.mainElem.firstChild) {
      this.mainElem.removeChild(this.mainElem.lastChild);
    }


  }
}

///view_startGame displays the information and controls about starting or joining a game
const view_startGame = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html1 = `<section>
    <div class="centercolumn" id="scoreboard">
      <div class="card">
        <h4>Login</h4>
        <div class="yaks">
            <label for="fname">Username:</label>
            <input type="text" id="fname" name="fname">
            <label for="lname">Password:</label>
            <input type="text" id="lname" name="lname">
            <input type="submit" value="Login">
        </div>
    </div><br>
      <div class="card" id="board">
        <h2>Start a new Game</h2>
          <h4>Options</h4>
            <div class="box"><br>
                <label for="myRange">Number of Gems</label>
                <input type="range" id="slider" min="3" max="20" value="3" step="3" oninput="document.getElementById('demo').innerHTML=this.value;model.gems=this.value;" class="slider"></input>
                <p>Value: <span id="demo">3</span></p>
            </div><br>
            
            <div class="box">
                <label for="noPlayers">Number of Players:</label>
                <select id="noPlayers">
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
            </div><br>
            <button id="btnStart" onclick="controller.startGame()">Start Game</button>
            </div>
            </div>
        </div>
        </div>
        </section>`;
    this.mainElem.innerHTML = this.html1;

    this.html2 = `<section>
      <h2>Join a Game</h2>
      <ul id="games">
      </ul>
    </section>`

  },

  listOpenGames: function () {
    this.mainElem.innerHTML = this.html1 + this.html2;
    this.gamesElem = document.getElementById('games');
    for (gameId of controller.getOpenGames()) {
      let listElem = document.createElement('li');
      let spanElem = document.createElement('span');
      let btnElem = document.createElement('button');
      spanElem.innerHTML = gameId + " ";
      btnElem.addEventListener('click', (function (gameId) {
        return function () {
          controller.joinGame(gameId);
        };
      })(gameId));
      btnElem.innerHTML = "Join game";
      listElem.append(spanElem);
      listElem.append(btnElem);
      this.gamesElem.append(listElem);
    }

  }
}

// This view should contain the game's board and information about the current score and turn
//1. INSERT BOARD HERE
const view_game = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html = `
    <section id="gamePlayed">   
    <div class="centercolumn">
        <div class="card" style="height:500px">
            <h4 >Current Game</h4>
            <div class="yaks" id="game">
            <button id="makeMove">Make move</button>
            </div>
        </div>
    </div>       
    <div class="centercolumn">
      <div class="card" style="height:500px">
        <h4 >Score</h4>
         <span>Your Score: </span>
         <span id="score">0</span>
         <div id="notice"></div>
      </div>
    </div> 
    </section>`
    this.mainElem.innerHTML = this.html;
    document.getElementById("makeMove").addEventListener('click', controller.makeMove);
    this.deactivate();
  },
  //If it's another player's turn the view needs to be deactivted
  deactivate: function () {
    document.getElementById("notice").innerHTML = "Not your turn or not enough players yet.";
    //the makeMove button is preliminary only, eventually moves should be made straight through the board
    document.getElementById("makeMove").removeEventListener('click', controller.makeMove);
    document.getElementById("makeMove").disabled = true;
  },
  //...and activated again once the turn starts
  activate: function () {
    document.getElementById("notice").innerHTML = "It's your turn now";
    document.getElementById("makeMove").addEventListener('click', controller.makeMove);
    document.getElementById("makeMove").disabled = false;
  }
}
controller.init();
