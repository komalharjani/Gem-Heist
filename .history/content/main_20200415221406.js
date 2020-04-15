// api object with endpoints and methods for various request types.

const api = {
  endpoints: [
    "/getPlayer/",
    "/getGame",
    "/getOpenGames/",
    "/addPlayer",
    "/getTurn",
    "/makeMove",
    "/addName"
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

// controller object is in charge of the Gem Heist client-side and controls all the model and view updates (except the model's initial updates)

const controller = {

  //initialiyes everything that's required for the game's start display
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
  startGame: async function (numberOfPlayers,gemsWidth,gemsHeight) {
    model.width = (gemsHeight * 2) + 1;
    model.height = (gemsWidth * 2) + 1;
    let temp = await api.get(1,["playerid="+model.player.id,"playerno="+numberOfPlayers,"boardheight="+model.height,"boardwidth="+model.width]);
    model.game = temp[0];
    model.currState=temp[1];
    view_frame.clear();
    view_game.init();
    view_game.drawBoard();
    controller.getTurn();
  },
  //called, when a player joins an existing game
  joinGame: async function (gameId) {
    model.game = gameId;
   
    let temp = await api.get(3, ["gameid=" + gameId, "playerid=" + model.player.id]);
    if (temp[0]) {
      model.currState=temp[1];
      view_frame.clear();
      view_game.init();
      view_game.drawBoard();
      view_game.activate();
    }
    else {
      model.currState=temp[1];
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
  //in order to know when it's one's turn the client has to constantly send requests to the api in order to check 
  getTurn: function () {
    let turnPolling = setInterval(async function () {
      let myTurn = await api.get(4, ["gameid=" + model.game, "playerid=" + model.player.id]);
      model.currState = myTurn[1];
      if (myTurn[0]) {
        clearInterval(turnPolling);
        view_game.activate();
      }
      if(myTurn[0]!=true&&myTurn[0]!=false){
        clearInterval(turnPolling);
        //console.log(myTurn[0]);
        let thisNotice = document.getElementById("notice")
        for(let i =0; i <myTurn[0].length; i++) {
          for(let j=0; j< myTurn[i].length; j++) {
            let listResults = document.createElement('li');
            listResults.innerHTML = myTurn[0][i].id + " has " + myTurn[0][i].outcome;
            //let spanResults = document.createElement('span');
            //spanResults = myTurn[0][i].id + " has " + myTurn[0][i].outcome;
            //listResults.append(spanResults);
            thisNotice.append(listResults);
          }
        }
      }
      view_game.drawBoard();
    }, 5000);
  },
  /* this is a preliminary method that should be called when a player makes a move.
  Any board's state could be passed through this api call*/
  makeMove: async function (event) {
    let currRow = event.target.getAttribute("row"); //curr row from event listener and table
    let currCol = event.target.getAttribute("col"); //curr col from event listener and table
    let temp = model.currState[currRow][currCol];
    console.log(temp);
    let data = {
      gameid: model.game,
      playerid: model.player.id, 
      move:temp
    };
    console.log(data);
    let outcome = await api.post(5,data);
    model.currState=outcome[0];
    switch(outcome[1]){ 
      case 0:
        view_game.drawBoard();
        view_game.deactivate();
        controller.getTurn();
        break;
      case 1:
        view_game.drawBoard();
        model.currScore++;
        break;
      case 2:
        view_game.drawBoard();
        view_game.deactivate();
        controller.getTurn();
        alert("It is not your turn.");
        break;
      case 3:
      view_game.drawBoard();
        alert("This is not a valid move.");
        break;
      case 4:
        view_game.drawBoard();
        view_game.deactivate();
        model.currScore++;
        alert("you have won.");
        //kill game?
    } 
    
  },
  leaveGame: function(){
    view_frame.clear()
    view_startGame.init();

  },
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
  gems: 3,
  player: {
    id: 0,
    name: "",
  },
  game: 0,
  currState:0,
  height:0,
  currScore: 0,
  width:0,
  openGames: [],
  /* When a new client is started, it "registers" itself through the api and gets a unique id
  it will also poll all the currently open games, so that the player can join any of them*/
  init: async function () {
    this.player.id = await api.get(0, "");
    this.openGames = await api.get(2, "");
  }

}


//This view is in charge of displaying the game's top player status bar
const view_playerStatus = {
  init: function () {
    this.playerElem = document.getElementById('playerName');
    //this.scoreElem = document.getElementById('score');
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
  render: function () {
    this.playerElem.innerHTML = controller.getPlayer()[0];
    if (controller.getPlayer()[1]) {
      this.playerNameBtnElem.remove();
    }
  },
  showModal: function (userNick) {
    this.modal.style.display = "block";
    this.cancelNick.onclick = closeModal;
    /*close the modal if the player clicks on the close icon or anywhere*/
    this.spanClose.onclick = closeModal;
    view_playerStatus.newNick.focus();
    this.submitNick.onclick = async function () {
      const nickStatus = await controller.newPlayerName(view_playerStatus.newNick.value);
      if (nickStatus == true) {
        view_playerStatus.newNick.value="";
        closeModal();
        view_playerStatus.render();
      } else if (nickStatus == false) {
        view_playerStatus.newNick.value="";
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
    <div class="centercolumn">
    <div class="card" style="height:500px;">
    <h2>Start a new Game</h2>
      <h4>Options</h4>
      <div class="box">
      <b><label for="widthRange">Width </label></b><br><br>
      <input type="range" min="1" max="10" value="3" oninput="document.getElementById('widthDisplay').innerHTML=this.value;model.gems=this.value;" class="slider" id="widthRange"></input><br>
      <p>Value: <span id="widthDisplay">3</span></p><br><br>
      <b><label for="heightRange">Height</label></b><br><br>
      <input type="range" min="1" max="10" value="3" oninput="document.getElementById('heightDisplay').innerHTML=this.value;model.gemsHeight=this.value;" class="slider" id="heightRange"></input>
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
    <div class="centercolumn">
          <div class="card" style="height:500px;">
      <h2>Join a Game</h2>
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

// This view should contain the game's board and information about the current score and turn
const view_game = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html = `<br><section class="card">
    <div class="card" id="board">
    </div><br>
                </section><br>
                <section class="card">
                <span><b>Your Score: </span><span id="score">0</b></span><br><br>
                <div class="notice" id="notice"></div><br>
                <button id="withdraw">Leave game</button><br>
                </div>
                </section>`
    this.mainElem.innerHTML = this.html;
    document.getElementById("withdraw").addEventListener('click', this.confirmWithdrawal);
    this.deactivate();
    this.gemChar = "&#128142";
  },

  confirmWithdrawal: function () {
    if (confirm("You're about to leave the game. This cannot be undone.")) {
      controller.leaveGame();
    }
  },

  //If it's another player's turn the view needs to be deactivted
  deactivate: function () {
    document.getElementById("notice").innerHTML = "Not your turn or not enough players yet.";
    //Here display message after won saying
    //document.getElementById("board").disabled = true();
    //document.getElementById("withdraw").disabled = true;
  },
  //...and activated again once the turn starts
  activate: function () {
    document.getElementById("notice").innerHTML = "It's your turn now";
  },
 
  drawBoard: function () {
    //Create rows and tables according to specified height and width
    document.getElementById("score").innerHTML = model.currScore;
    var table = document.createElement("table");
    for (var i = 0; i < model.currState.length; i++) { //loop through height
      var row = document.createElement('tr'); //create rows for each height
      for (var j = 0; j < model.currState[0].length; j++) { //loop through width
        var cell = document.createElement('td'); //create columns for each width
        cell.setAttribute("row", i);
        cell.setAttribute("col", j);

        if (model.currState[i][j].state == true) {
          if (model.currState[i][j].type == "gem") { //identify gem cells
            cell.innerHTML = this.gemChar;
            cell.className = "gem";
          }
          else if (model.currState[i][j].type == "alarm") { //identify alarm cells
            cell.className = "alarm";
            cell.addEventListener('click', function (event) {
              this.className = "white";
              controller.makeMove(event);
            })
          }
        }
        else {
          cell.className = "white"
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
  }

}



controller.init();