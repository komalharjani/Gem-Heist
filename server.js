// make available the necessary other modules
let express = require('express');
let bodyParser = require('body-parser');
let model = require('./model.js');
let app = express();
app.use(bodyParser.json())
app.use(express.static('content/'));
//start the server
app.listen(3000, () => {
	console.log('Listening on localhost:3000');
});
//create a session that stores games and players
let session = new model.Session()

//endpoint to create a new game. It automatically adds the requesting client as a first player
app.get('/getGame/:playerid', function(req,res,next) {
	let game=new model.Game();
  session.updateOpenGames(game.getId());
	game.addPlayer(req.params.playerid);
	session.updateGames(game);
  res.status(200).json(game.getId());
});

/*endpoint to add a player to an existing game. If the added player completes a game (in terms of number of players) that game is removed from the 'openGames' list */
app.get('/addPlayer', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	let index = game.addPlayer(req.query.playerid,session.getOpenGames())
	if(index!=-1){
	session.getOpenGames().splice(index,1);
  res.status(200).json(true);
	}
	else{
		res.status(200).json(false);
	}
});
//creates a new player and adds it to the server's session
app.use('/getPlayer/', function(req,res,next) {
	let player = new model.Player();
  session.addPlayer(player);
  console.log(player.getId());

	res.status(200).json(player.getId());

});

//endpoint that returns the games that are currently open (have not been started)
app.use('/getOpenGames/', function(req,res,next) {
	res.status(200).json(session.getOpenGames());
});

//takes in a player and game id and returns true if it's that player's turn
app.use('/getTurn', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	let myTurn=game.getPlayerTurn(req.query.playerid);
	res.status(200).json(myTurn);
});

//endpoint that initiates a move (provided you pass it a game id) 
app.use('/makeMove', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	game.makeMove(req.query.playerid);

	res.status(200).json(true);
});
