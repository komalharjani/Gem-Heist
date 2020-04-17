// api object with endpoints and methods for various request types.

const api = {
  endpoints: [
    "/getPlayer/",
    "/getGame",
    "/getOpenGames/",
    "/addPlayer",
    "/getTurn",
    "/makeMove",
    "/addName",
    "/getPlayerScore"
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
      const postResponse = await fetch(this.endpoints[endpoint], {
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

/**
 * controller object is in charge of the Gem Heist client-side and controls all the model and view updates (except the model's initial updates)
 */
const controller = {

  //initialises everything that's required for the game's start display
  init: async function () {
    await model.init();
    view_frame.init();
    view_playerStatus.init();
    view_startGame.init();
    if (controller.getOpenGames().length >= 1) {
      view_startGame.listOpenGames();
    }
  },
  //called, when a player starts a new game
  startGame: async function (numberOfPlayers, gemsWidth, gemsHeight) {
    model.width = (gemsWidth * 2) + 1;
    model.height = (gemsHeight * 2) + 1;
    let temp = await api.get(1, ["playerid=" + model.player.id, "playerno=" + numberOfPlayers, "boardheight=" + model.height, "boardwidth=" + model.width]);
    model.game = temp[0];
    model.currState = temp[1];
    view_playerStatus.render();
    view_frame.clear();
    view_game.init();
    view_game.drawBoard();
    controller.getTurn();
  },
  
  /**
   * called, when a player joins an existing game
   * @param {*} gameId 
   */
  joinGame: async function (gameId) {
    model.game = gameId;
    let temp = await api.get(3, ["gameid=" + gameId, "playerid=" + model.player.id]);
    //depending on whether the joining player completes the game, it starts
    if (temp[0]) {
      model.currState = temp[1];
      view_playerStatus.render();
      view_frame.clear();
      view_game.init();
      view_game.drawBoard();
      view_game.activate();
    }
    //or will show a deactivated board only
    else {
      model.currState = temp[1];
      view_playerStatus.render();
      view_frame.clear();
      view_game.init();
      view_game.drawBoard();
      view_game.deactivate();
      this.getTurn();
    }
  },
  //returns the games that are currently open to be joined
  getOpenGames: function () {
    return model.openGames;
  },
  //returns the player's id that is permanently stored in the model
  getPlayer: function () {
    if (model.player.name != "") {
      return ["Player: " + model.player.name, true];
    }
    else {
      return ["Player: " + " ..." + model.player.id.slice(-5), false];
    }
  },
  // retrieves a player's score (number of wins)
  getPlayerScore: async function () {
    const data = {
      "playerid": model.player.id
    };
    const json = await api.post(7, data);
    model.player.wins = json.win;
    model.player.draws = json.draw;
    model.player.losses = json.loss;
  },
  //in order to know when it's one's turn the client has to constantly send requests to the api in order to check 
  getTurn: function () {
    let turnPolling = setInterval(async function () {
      let myTurn = await api.get(4, ["gameid=" + model.game, "playerid=" + model.player.id]);
      //store the updated board in the model
      model.currState = myTurn[1];
      //if myTurn is true activate the board and stop polling
      if (myTurn[0]) {
        clearInterval(turnPolling);
        view_game.activate();
      }
      //if myTurn is neither true nor false, the game is over - update the player's statistics and display the outcome(s) of the game
      if (myTurn[0] != true && myTurn[0] != false) {
        clearInterval(turnPolling);
        // update player's games statistic
        model.player.wins = myTurn[2].win;
        model.player.draws = myTurn[2].draw;
        model.player.losses = myTurn[2].loss;
        view_playerStatus.render();
        view_game.deactivate();
        view_game.displayResults(myTurn[0]);
      }
      view_game.drawBoard();
    }, 2000);
  },

  /**
   * this is called when a player makes a move, i.e. disables an alarm
   * the coordinates of the alarm as well as the game's and player's id are being passed to the server
   * @param {*} event 
   */
  makeMove: async function (event) {
    let currRow = event.target.getAttribute("row"); //curr row from event listener and table
    let currCol = event.target.getAttribute("col"); //curr col from event listener and table
    let temp = model.currState[currRow][currCol];
    
    let data = {
      gameid: model.game,
      playerid: model.player.id,
      move: temp
    };
    console.log(data);
    //send the game id, player id and the alarm's coordinates to the makeMove endpoint
    let outcome = await api.post(5, data);
    //update the mode with the new board state
    model.currState = outcome[0];
    //evaluate the makeMove flag which tells the client what the result of the disabled alarm is
    switch (outcome[1]) {
      //No gem collected
      case 0:
        view_game.drawBoard();
        view_game.deactivate();
        controller.getTurn();
        break;
      //1 or 2 gem collected
        case 1:
        model.currScore=outcome[2];
        view_game.drawBoard();
        break;
      // wrong turn
        case 2:
        view_game.drawBoard();
        view_game.deactivate();
        controller.getTurn();
        alert("It is not your turn.");
        break;
        //invalid move
      case 3:
        view_game.drawBoard();
        alert("This is not a valid move.");
        break;
        // 1 or 2 gem collected and game completed
      case 4:
        model.currScore=outcome[3];
        await this.getPlayerScore();
        view_playerStatus.render();
        view_game.drawBoard();
        view_game.deactivate();
        view_game.displayResults(outcome[2]);
        console.log(outcome[2]);
    }
  },
  leaveGame: function () {
    view_frame.clear()
    view_startGame.init();
  },
  
  /**
   * sets a player's name, returns false if the name is already taken by a different user
   * @param {*} newPlayerName 
   */
  newPlayerName: async function (newPlayerName) {
    const data = {
      "playerName": newPlayerName,
      "playerId": model.player.id
    };
    const json = await api.post(6, data);
    if (json == false) {
      return false;
    }
    if (json == true) {
      model.player.name = newPlayerName;
      return true;
    }
  }
}

// the client's model stores all the data that the client needs. This does not include information about other players ids, etc.
const model = {
  player: {
    id: 0,
    name: "",
    wins: 0,
    losses: 0,
    draws: 0
  },
  game: 0,
  currState: 0,
  currScore: 0,
  height: 0,
  width: 0,
  openGames: [],
  /* When a new client is started, it "registers" itself through the api and gets a unique id
  it will also poll all the currently open games, so that the player can join any of them*/
  init: async function () {
    this.player.id = await api.get(0, "");
    this.openGames = await api.get(2, "");
  },
  //method to reset all the information about a game, so that a new one can be started
  resetGame: function(){
    this.game=0;
    this.currState=0;
    this.height=0;
    this.width=0;
  }

}


//This view is in charge of displaying the game's top player status bar
const view_playerStatus = {
  init: function () {
    this.playerElem = document.getElementById('playerName');
    this.scoreElem = document.getElementById('score');
    this.playerNameBtnElem = document.getElementById("nickNameBtn");
    this.playerNameBtnElem.addEventListener('click', function () {
      view_playerStatus.showModal();
    });
    this.modal = document.getElementById('myModal');
    this.currentNick = document.getElementById('currentNick');
    this.spanClose = document.getElementsByClassName("close")[0];
    this.cancelNick = document.getElementById("cancelNick");
    this.submitNick = document.getElementById("submitNick");
    this.newNick = document.getElementById("newNick");
    this.render();
  },
  //disables the add name button if the name is set already or if the game has already started
  render: function () {
    this.playerElem.innerHTML = controller.getPlayer()[0];
    if (controller.getPlayer()[1]||model.game!==0) {
      this.playerNameBtnElem.disabled = true;
    }
    //updates the current player's stats
    this.scoreElem.innerHTML = "Your Stats: Wins: " + model.player.wins + " Losses: " + model.player.losses + " Draws: " + model.player.draws;
  },
  
  /**
   * displays modal that prompts for name input
   * @param {*} userNick 
   */
  showModal: function (userNick) {
    this.modal.style.display = "block";
    this.cancelNick.onclick = closeModal;
    /*close the modal if the player clicks on the close icon or anywhere*/
    this.spanClose.onclick = closeModal;
    view_playerStatus.newNick.focus();
    this.submitNick.onclick = async function () {
      const nickStatus = await controller.newPlayerName(view_playerStatus.newNick.value);
      if (nickStatus == true) {
        view_playerStatus.newNick.value = "";
        closeModal();
        view_playerStatus.render();
      } else if (nickStatus == false) {
        view_playerStatus.newNick.value = "";
        alert("This Name is already taken by another player.");
        view_playerStatus.newNick.focus();
      }
    }

    function closeModal() {
      view_playerStatus.modal.style.display = "none";
    }
    window.onclick = function (event) {
      if (event.target == view_playerStatus.modal) {
        view_playerStatus.modal.style.display = "none";
      }
    }

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
    <br>
    <div>
    <div class="card">
    <h2>Start a new Game</h2>
      <h4>Options</h4>
      <div class="box">
      <b><label for="widthRange">Width </label></b><br><br>
      <input type="range" min="2" max="10" value="3" oninput="document.getElementById('widthDisplay').innerHTML=this.value;" class="slider" id="widthRange"></input><br>
      <p>Value: <span id="widthDisplay">3</span></p><br><br>
      <b><label for="heightRange">Height</label></b><br><br>
      <input type="range" min="2" max="10" value="3" oninput="document.getElementById('heightDisplay').innerHTML=this.value;" class="slider" id="heightRange"></input>
      <p>Value: <span id="heightDisplay">3</span><p>
       
      </div>
      <br>
      <div class="box">
          <label for="noPlayers">Number of Players:</label>
          <select id="noPlayers">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
      </div><br>
      <button id="btnStart" onclick="controller.startGame(noPlayers.value,widthRange.value,heightRange.value)">Start Game</button><br>
  </div>
  </div>
    
  </section>`;
    this.mainElem.innerHTML = this.html1;

    this.html2 = `<section>
    <div class="card" id="JoinGame">
    <h2>Join a Game</h2>
          <div class="box">
      
      <ul id="games">
      </ul>
      </div>
      </div>
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

// This view contains the game's board and information about the current score (number of gems collected) and turn
const view_game = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html = `<br><section class="card">
    <div class="board" id="board">
    </div><br>
    
                </section><br>
                <section class="card">
                <span>Gems: </span><span id="currentScore">0</span><br><br>
                <div class="notice" id="notice"></div><br>
                <button id="withdraw">Leave game</button><br>
                </div>
                </section>`
    this.mainElem.innerHTML = this.html;

    document.getElementById("withdraw").addEventListener('click', this.confirmWithdrawal);
    this.deactivate();
    this.gemChar = "&#128142";
  },
  //If it's another player's turn the view needs to be deactivted
  deactivate: function () {
    //Disable pointerEvents
    document.getElementById("board").style.pointerEvents = "none";
    document.getElementById("notice").innerHTML = "Not your turn or not enough players yet.";
    document.getElementById("withdraw").disabled = true;
    //Add Opacity
    document.getElementById("board").style.opacity = "0.5";
  },
  //...and activated again once the turn starts
  activate: function () {
    //Enable pointerEvents
    document.getElementById("board").style.pointerEvents = "auto";
    document.getElementById("notice").innerHTML = "It's your turn now";
    //Remove Opacity
    document.getElementById("board").style.removeProperty('opacity');
  },
  confirmWithdrawal: function () {
    if (confirm("You're about to leave the game. This cannot be undone.")) {
      controller.leaveGame();
    }
  },
  /**
   * Function to DrawBoard on inital starting of game but also called after every move is made
   */
  drawBoard: function () {
    // displays the player's score (i.e. no of gems collected in that game)
    document.getElementById("currentScore").innerHTML = model.currScore;
    //Create rows and tables according to specified height and width
    var table = document.createElement("table");
    for (var i = 0; i < model.currState.length; i++) {
      var row = document.createElement('tr'); //create rows for each height
      for (var j = 0; j < model.currState[0].length; j++) { 
        var cell = document.createElement('td'); //create columns for each width within each row
        cell.setAttribute("row", i); //set row attribute
        cell.setAttribute("col", j); //set col attribute

        //Identify all cells set to true and give them CSS properties
        if (model.currState[i][j].state == true) {
          //gem cells
          if (model.currState[i][j].type == "gem") { 
            cell.innerHTML = this.gemChar;
            cell.className = "gem";
          }
          //alarm cells
          else if (model.currState[i][j].type == "alarm") { 
            cell.className = "alarm";
            cell.addEventListener('click', function (event) {
              this.className = "white";
              controller.makeMove(event);
            })
          }
        }
        else {
          cell.className = "white"
          //Redraw with name in center
          if (model.currState[i][j].type == "gem") {
            cell.innerHTML = model.currState[i][j].name;
          }
        }
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    //display in this div
    let divContainer = document.getElementById("board");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  },
  //method to display all of a game's results once it is completed
  displayResults: function (outcome) {
    let thisNotice = document.getElementById("notice")
    thisNotice.innerHTML = "Game completed";
    for (let i = 0; i < outcome.length; i++) {
      let listResults = document.createElement('li');
      let clientName = outcome[i].name;
      if (clientName === '') {
        if (outcome[i].id !== model.player.id.slice(-5)) {
          listResults.innerHTML = outcome[i].id + ": " + outcome[i].outcome;
        }
        else {
          listResults.innerHTML = "You: " + outcome[i].outcome;
        }
      }
      else {
        if (outcome[i].name !== model.player.name) {
          listResults.innerHTML = outcome[i].name + ": " + outcome[i].outcome;
        }
        else {
          listResults.innerHTML = "You: " + outcome[i].outcome;
        }
      }
      thisNotice.append(listResults);
    }
    

  }
}



controller.init();