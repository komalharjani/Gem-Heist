let express = require('express');
let bodyParser = require('body-parser');
let model = require('./model.js');
let app = express();
app.use(bodyParser.json())
app.use(express.static('content/'));
app.listen(3000, () => {
	console.log('Listening on localhost:3000');
});
let session = new model.Session()
app.get('/getGame/:playerid', function(req,res,next) {
	let game=new model.Game();
  session.updateOpenGames(game.getId());
	game.addActivePlayer(req.params.playerid);
	session.updateGames(game);
  console.log(game.getId());
	console.log(game.getActivePlayers())
  //game=JSON.stringify(game);
  res.status(200).json(game.getId());
});
app.get('/addPlayer', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	let index = game.addActivePlayer(req.query.playerid,session.getOpenGames())
	if(index!=-1){
	session.getOpenGames().splice(index,1);
	console.log("Game ready:"+ index + "game id" + req.query.gameid +"player id: " + req.query.playerid)
  res.status(200).json(true);
	}
	else{
		res.status(200).json(false);
	}
});
app.use('/getPlayer/', function(req,res,next) {
	let player = new model.Player();
  session.addPlayer(player);
  console.log(player.getId());

	res.status(200).json(player.getId());

});
app.use('/getOpenGames/', function(req,res,next) {
  console.log('opengames'+session.getOpenGames());

	res.status(200).json(session.getOpenGames());
});
app.use('/getTurn', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	let myTurn=game.getPlayerTurn(req.query.playerid);
	console.log(myTurn);
	res.status(200).json(myTurn);
});
app.use('/makeMove', function(req,res,next) {
	let game=session.getGame(req.query.gameid);
	game.makeMove(req.query.playerid);

	res.status(200).json(true);
});
