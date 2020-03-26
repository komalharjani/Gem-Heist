// api object

const api = {
  endpoints: [
    "/getPlayer/",
    "/getGame/",
    "/getOpenGames/",
    "/addPlayer",
    "/getTurn",
    "/makeMove"
  ],
  get: async function(endpoint, params) {
    if (typeof(params) == "object") {
      params = "?"+params.join("&");
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
  post: async function(endpoint, data) {
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



const controller = {
  init: async function() {
    await model.init();
    view_frame.init();
    view_userStatus.init();
    view_startGame.init();
  },
  startGame: async function() {
    model.game = await api.get(1, model.player);
    view_frame.clear();
    view_game.init();
    controller.getTurn();
  },
  joinGame: async function(gameId) {
    model.game=gameId;
    view_frame.clear();
    view_game.init();
    if(await api.get(3,["gameid="+gameId,"playerid="+model.player])){
      view_game.activate();
    }
    else{
      view_game.deactivate();
    }
  },
  getOpenGames: function() {
    return model.openGames;
  },
  getUser: function() {
    return model.player;
  },
  getTurn: function(){
    let turnPolling = setInterval(async function(){
      let myTurn=await api.get(4,["gameid="+model.game,"playerid="+model.player]);
      if (myTurn){
        clearInterval(turnPolling);
        view_game.activate();
      }
    }, 5000);
  },
  makeMove: async function(){
    await api.get(5,["gameid="+model.game,"playerid="+model.player]);
    view_game.deactivate();
    controller.getTurn();
  }

}





const model = {

  player: 0,
  game: 0,
  openGames: [],
  init: async function() {
    this.player = await api.get(0, "");
    this.openGames = await api.get(2, "");
  }

}



const view_userStatus = {
  init: function() {
    this.userElem = document.getElementById('userName');
    //this.scoreElem = document.getElementById('score');
    this.render();
  },
  render: function() {
    this.userElem.innerHTML = 'User: ' + controller.getUser();
  }
}

const view_frame = {
  init: function() {
    this.mainElem = document.getElementsByTagName('main')[0];
  },
  clear: function() {
    while(this.mainElem.firstChild){
      this.mainElem.removeChild(this.mainElem.lastChild);
    }


  }
}

const view_startGame = {
  init: function() {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html1 = `<section>
          <h2>Start a new Game</h2>
          <button id="btnStart" onclick="controller.startGame()">Start Game</button>
        </section>`;
    this.mainElem.innerHTML = this.html1;
    this.html2 = `<section>
      <h2>Join a Game</h2>
      <ul id="games">
      </ul>
    </section>`
    //document.getElementById("btnStart").addEventListener('click', controller.startGame)
    this.render();
  },
  render: function() {
    if (controller.getOpenGames().length >= 1) {
      this.mainElem.innerHTML = this.html1 + this.html2;
      this.gamesElem = document.getElementById('games');
      for (gameId of controller.getOpenGames()) {
        let listElem = document.createElement('li');
        let spanElem = document.createElement('span');
        let btnElem = document.createElement('button');
        spanElem.innerHTML = gameId + " ";
        btnElem.addEventListener('click', (function(gameId) {
          return function() {
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
}

const view_game = {
  init: function() {
    this.mainElem = document.getElementsByTagName('main')[0];
    this.html = `<section id="board">
    <div><br>The game board will be here.<br><br></div>
    <button id="makeMove" disabled>Make move</button>
                </section>
                <section>
                <span>Your Score: </span><span id="score">0</span>
                <div id="notice"></div>
                </section>`
    this.mainElem.innerHTML = this.html;
    document.getElementById("makeMove").addEventListener('click',controller.makeMove);
    this.deactivate();
  },
  deactivate: function() {
    document.getElementById("notice").innerHTML="Not your turn or not enough players yet.";
    document.getElementById("makeMove").removeEventListener('click',controller.makeMove);
    document.getElementById("makeMove").disabled=true;
  },
  activate: function(){
    document.getElementById("notice").innerHTML="It's your turn now";
    document.getElementById("makeMove").addEventListener('click',controller.makeMove);
    document.getElementById("makeMove").disabled=false;
  }
}
controller.init();
