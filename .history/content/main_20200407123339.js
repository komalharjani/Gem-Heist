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
    //var noGems = 12; //Hardcoded to 9 - but change to responsive
    var noGems = document.getElementById("slider").value;
    height = (2 / 3 * noGems) + 1;

    /**
     * Declare 2D array to store gems and alarms
     */
    var pieces = [];
    for (var i = 0; i < height; i++) {
        pieces[i] = [];
    }
    console.log(pieces);

    var table = document.createElement("table");
    for (var i = 0; i < height; i++) { //loop through height
        var row = document.createElement('tr'); //create rows for each height
        for (var j = 0; j < width; j++) { //loop through width
            var cell = document.createElement('td'); //create columns for each width
            pieces[i].push(cell);
            cell.setAttribute("row", i);
            cell.setAttribute("col", j);

            //Identify Gem Cells
            if (j % 2 && i % 2) {
                cell.innerHTML = gemChar;
                cell.className = "gem";
                //example - move out later to follow after alarm captured
                cell.addEventListener('click', function (event) { //disable after clicked + how to pass row and col
                    this.innerHTML = "name";
                })
            }
            //Identify Alarms
            else if (j % 2 || i % 2) {
                cell.className = "alarm";
                cell.addEventListener('click', function (event) { //disable after clicked + how to pass row and col
                    this.className = "white";
                    disableAlarm();
                    event.preventDefault();
                })
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

  //Disable Alarm Function
  disableAlarm: function() {
      let currRow = event.target.getAttribute("row"); //curr row
      let currCol = event.target.getAttribute("col"); //curr col
      console.log(currRow,currCol);
      if (currRow-1 == gemChar) {
          console.log("true");
      }
      console.log(event.target);
  },

  replay: function() {
    //queue
    
  },

  declareWinner: function() {
    let gemsToWin = player.length / noGems;
    if (player.score = gemsToWin) {
      //alert
      //kill game - how?
      //update leagueboard
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
                <input type="range" id="slider" min="3" max="20" value="3" step="3";" class="slider"></input>
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
