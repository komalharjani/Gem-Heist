const view_userStatus ={
  init:function(){
    let this.userElem=document.getElementById('userName');
    let this.scoreElem=document.getElementById('score');
  },
  render:function(){
    this.userElem=model.getUser();
    this.scoreElem=model.getScore();
  }
}

const view_Frame ={
  init:function(){
    let this.mainElem=document.getElementsByTag('main')[0];
  },
  render:function(){
    this.mainElem.innerHTML="";
  }
}

const view_startGame ={
  init:function(){
    let this.mainElem=document.getElementsByTag('main')[0];
    let this.html=`<section>
          <h2>Start a new Game</h2>
          <button id="btnStart">Start Game</button>
        </section>
        <section>
          <h2>Join a Game</h2>
          <ul id="games">
          </ul>
        </section>`
    let this.entryHtml=`<span>${gameId}</span><button>Join Game</button>`
    this.mainElem.innerHTML=this.html;
    this.gamesElem=document.getElementsById('games');
  },
  render:function(){
    for game in model.getOpenGames(){
      let listElem=document.createElement('li');
      let spanElem=document.createElement('span');
      let btnElem=document.createElem('button');
      spanElem.innerHTML=game;
      btnElemen.addEventListener('click', (function(game) {
        return function() {
          controller.startGame(game);
        };
      })(game));
      listElem.append(spanElem);
      listElem.append(btnElem);
      this.gamesElem.append(listElem);
    }

  }
}
