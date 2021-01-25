// make available the necessary other modules
console.log("hello");
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
app.get('/getGame', function (req, res, next) {
	console.log(req.query.playerno);
	let game = new model.Game(req.query.playerno,req.query.boardheight,req.query.boardwidth);
	session.updateOpenGames(game.getId());
	game.addPlayer(req.query.playerid);
	session.updateGames(game);
	res.status(200).json([game.getId(),game.getBoard()]);
});

/*endpoint to add a player to an existing game. If the added player completes a game (in terms of number of players) that game is removed from the 'openGames' list */
app.get('/addPlayer', function (req, res, next) {
	
	let game = session.getGame(req.query.gameid);
	let index = game.addPlayer(req.query.playerid, session.getOpenGames())
	if (index != -1) {
		session.getOpenGames().splice(index, 1);
		res.status(200).json([true,game.getBoard()]);
	}
	else {
		res.status(200).json([false,game.getBoard()]);
	}
});
//creates a new player and adds it to the server's session
app.get('/getPlayer/', function (req, res, next) {
	let player = new model.Player();
	session.addPlayer(player);
	console.log(player.getId());

	res.status(200).json(player.getId());

});

//endpoint that returns the games that are currently open (have not been started)
app.get('/getOpenGames/', function (req, res, next) {
	res.status(200).json(session.getOpenGames());
});

//takes in a player and game id and returns true if it's that player's turn
app.get('/getTurn', function (req, res, next) {
	let game = session.getGame(req.query.gameid);
	let myTurn = game.getPlayerTurn(req.query.playerid);
	res.status(200).json([myTurn,game.getBoard()]);
});

//endpoint that initiates a move (provided you pass it a game id)
app.post('/makeMove', function (req, res, next) {
	let game = session.getGame(req.body.gameid);
	console.log(req.body.move.row);
	let outcome = game.makeMove(req.body.playerid,req.body.move.row,req.body.move.col);
	res.status(200).json(outcome);
});
//endpoint for a player to add name
app.post('/addName', function (req, res, next) {
	let name = req.body.playerName;
	let id = req.body.playerId;
	console.log(name);
	if (session.nameTaken(name, id)) {
		
		res.status(200).json(false);
	}
	else {
		
		res.status(200).json(true);
	}
});