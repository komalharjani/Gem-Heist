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
  startGame: async function (numberOfPlayers) {
    console.log(numberOfPlayers);
    model.game = await api.get(1,["playerid="+model.player.id,"playerno="+numberOfPlayers]);
    view_frame.clear();
    view_game.init();
    this.createBoard();
    controller.getTurn();
  },
  createBoard: function () {

    const height = Math.floor(2 / 3 * model.gems) + 1;
    console.log("create board" + height);
    const width = 7;
    const gemChar = '&#128142';
    model.board = new Array(height);
    for (let k = 0; k < model.board.length; k++) {
      model.board[k] = new Array(width);
    }
    let table = document.createElement("table");
    for (let i = 0; i < model.board.length; i++) {
      let row = document.createElement('tr');
      for (let j = 0; j < model.board[i].length; j++) {
        let col = document.createElement('td');
        if (j % 2 && i % 2) { //identify gem cells
          model.board[0].push(col); //HELP --> need to push into array while retaining table structure
          col.innerHTML = gemChar;
          col.className = "gem";
        }
        else if (j % 2 || i % 2) { //identify alarm cells
          col.className = "alarm";
          model.board.push(col);
        }
        row.appendChild(col);
      }
      table.appendChild(row);
    }
    document.getElementById("board").append(table);

  },
  //called, when a player joins an existing game
  joinGame: async function (gameId) {
    model.game = gameId;
    view_frame.clear();
    view_game.init();
    if (await api.get(3, ["gameid=" + gameId, "playerid=" + model.player.id])) {
      view_game.activate();
    }
    else {
      this.getTurn();
      view_game.deactivate();
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
      if (myTurn) {
        clearInterval(turnPolling);
        view_game.activate();
      }
    }, 5000);
  },
  /* this is a preliminary method that should be called when a player makes a move.
  Any board's state could be passed through this api call*/
  makeMove: async function () {
    data = {
      gameid: model.game,
      playerid: model.player.id,
      move:{}
    };
    await api.post(5,data);
    view_game.deactivate();
    controller.getTurn();
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
  },
  leaveGame: function(){
  }
}



// the client's model stores all the data that the client needs. This does not include information about other players ids, etc.
const model = {
  gems: 3,
  player: {
    id: 0,
    name: ""
  },
  game: 0,
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
          <h2>Start a new Game</h2>
          <div class="card">
            <h4>Options</h4>
            <div class="box">
            <label for="myRange">Number of Gems</label>
            <br>
            <input type="range" min="3" max="20" value="3" oninput="document.getElementById('demo').innerHTML=this.value;model.gems=this.value;" class="slider" id="myRange"></input>
            <p>Value: <span id="demo">3</span></p>
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
            </div>
        </div>
        <button id="btnStart" onclick="controller.startGame(noPlayers.value)">Start Game</button>
          
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
const view_game = {
  init: function () {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html = `<section id="board">
    
                </section>
                <button id="makeMove">Make move</button>
                <section>
                <span>Your Score: </span><span id="score">0</span>
                <div id="notice"></div>
                <button id="withdraw">Leave game</button>
                </section>`
    this.mainElem.innerHTML = this.html;
    document.getElementById("makeMove").addEventListener('click', controller.makeMove);
    document.getElementById("withdraw").addEventListener('click', this.confirmWithdrawal);
    this.deactivate();
  },
  //If it's another player's turn the view needs to be deactivted
  deactivate: function () {
    document.getElementById("notice").innerHTML = "Not your turn or not enough players yet.";
    //the makeMove button is preliminary only, eventually moves should be made straight through the board
    document.getElementById("makeMove").removeEventListener('click', controller.makeMove);
    document.getElementById("makeMove").disabled = true;
    document.getElementById("withdraw").disabled = true;
  },
  //...and activated again once the turn starts
  activate: function () {
    document.getElementById("notice").innerHTML = "It's your turn now";
    document.getElementById("makeMove").addEventListener('click', controller.makeMove);
    document.getElementById("makeMove").disabled = false;
  },
  confirmWithdrawal: function(){
    if (confirm("You're about to leave the game. This cannot be undone.")){
      controller.leaveGame();
    }
  }

}

controller.init();
