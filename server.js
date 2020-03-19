let express = require('express');
let bodyParser = require('body-parser');

let model = require('./model.js');

let app = express();
app.use(bodyParser.json())
app.use(express.static('content/'));
app.listen(3000, () => {
	console.log('Listening on localhost:3000');
});
app.get('/getGame/:playerid', function(req,res,next) {
	let game=new model.model.Game();
  model.model.updateOpenGames(game.getId());
	game.addActivePlayer(req.params.playerid);
	model.model.updateGames(game);
  console.log(game.getId());
	console.log(game.getActivePlayers())
  //game=JSON.stringify(game);
  res.status(200).json(game.getId());
});
app.get('/addPlayer', function(req,res,next) {

	let game=model.model.getGame(req.query.gameid);
	let index = game.addActivePlayer(req.query.playerid,model.model.getOpenGames())
	if(index!=-1){
	model.model.getOpenGames().splice(index,1);
	console.log("Game ready:"+ index + "game id" + req.query.gameid +"player id: " + req.query.playerid)
  res.status(200).json(true);
	}
	else{
		res.status(200).json(false);
	}
});
app.use('/getPlayer/', function(req,res,next) {
	let player = new model.model.Player();
  model.model.players.push(player);
  console.log(player.getId());
  //player=JSON.stringify(player);
	res.status(200).json(player.getId());

});
app.use('/getOpenGames/', function(req,res,next) {
  console.log('opengames'+model.model.getOpenGames());
  //player=JSON.stringify(player);
	res.status(200).json(model.model.getOpenGames());

});
