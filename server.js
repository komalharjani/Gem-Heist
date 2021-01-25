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
	let player = session.getPlayer(req.query.playerid);
	let game = new model.Game(req.query.playerno, req.query.boardheight, req.query.boardwidth);
	session.updateOpenGames(game.getId());
	game.addPlayer(req.query.playerid, player.getName());
	session.updateGames(game);
	//return the new game's id and the initial board state
	res.status(200).json([game.getId(), game.getBoard()]);
});

/*endpoint to add a player to an existing game. If the added player completes a game (in terms of number of players) that game is removed from the 'openGames' list */
app.get('/addPlayer', function (req, res, next) {
	let player = session.getPlayer(req.query.playerid);
	let game = session.getGame(req.query.gameid);
	let index = game.addPlayer(req.query.playerid, player.getName(), session.getOpenGames())
	//if the game's no of players is now met, return true and the initial state of the board
	if (index != -1) {
		session.getOpenGames().splice(index, 1);
		res.status(200).json([true, game.getBoard()]);
	}
	//if the game's no of players is not met, return false and the initial state of the board
	else {
		res.status(200).json([false, game.getBoard()]);
	}
});
//creates a new player and adds it to the server's session
app.get('/getPlayer/', function (req, res, next) {
	let player = new model.Player();
	session.addPlayer(player);
	//return the new player's id
	res.status(200).json(player.getId());
});
//gets a player's scores (number of wins, losses...)
app.post('/getPlayerScore', function (req, res, next) {
	let player = session.getPlayer(req.body.playerid);
	console.log(player.getScore());
	//return that player's scores
	res.status(200).json(player.getScore());
});
//endpoint that returns the games that are currently open (have not been started)
app.get('/getOpenGames/', function (req, res, next) {
	res.status(200).json(session.getOpenGames());
});

//takes in a player and game id and returns true if it's that player's turn
app.get('/getTurn', function (req, res, next) {
	let game = session.getGame(req.query.gameid);
	// check if it is that player's turn (true or false)
	let myTurn = game.getPlayerTurn(req.query.playerid);
	//if the game is done don't return true or false but rather all the players outcomes in that game
	if (game.getGameDone()) {
		for (i = 0; i < myTurn.length; i++) {
			myTurn[i].id = myTurn[i].id.slice(-5);
		}
	}
	let player = session.getPlayer(req.query.playerid);
	//finally return everything including the player's score which will be displayed if the game is done
	res.status(200).json([myTurn, game.getBoard(), player.getScore()]);
});

//endpoint that initiates a move (provided you pass it a game id)
app.post('/makeMove', function (req, res, next) {
	let game = session.getGame(req.body.gameid);
	let player = session.getPlayer(req.body.playerid);
	let outcome;
	if (req.body.move != "leave") {
		// makeMove returns the move's outcome, an integer flag indicating the move's result and and the new state of the board as the second element
		// a third element contains the game's outcome if this was the final move
		outcome = game.makeMove(req.body.playerid, player.getName(), req.body.move.row, req.body.move.col);
		// if the game is done iterate through the player's and update their score according to the game's outcome
	if (game.getGameDone()) {
		for (i = 0; i < outcome[2].length; i++) {
			let player = session.getPlayer(outcome[2][i].id);
			player.updateScore(outcome[2][i].outcome);
			outcome[2][i].id = outcome[2][i].id.slice(-5);
		}

	}
	}
	// special generation of outcomes if one player has chosen to leave the game
	else {
		outcome = game.leaveGame(req.body.playerid);
		player.updateScore("loss");
		
		
			for (i = 0; i < outcome[2].length; i++) {
				outcome[2][i].id = outcome[2][i].id.slice(-5);
			}

		
	}


	//return everything
	res.status(200).json(outcome);

});
//endpoint for a player to add name
app.post('/addName', function (req, res, next) {
	let name = req.body.playerName;
	let id = req.body.playerId;
	if (session.nameTaken(name, id)) {
		//return false if that name is already taken
		res.status(200).json(false);
	}
	else {
		//return true if the name was updated accordingly
		res.status(200).json(true);
	}
});