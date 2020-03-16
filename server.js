let express = require('express');
let bodyParser = require('body-parser');

let model = require('./model.js');

let app = express();
app.use(bodyParser.json())
app.use(express.static('content/'));
app.listen(3000, () => {
	console.log('Listening on localhost:3000');
});
app.use('/getGame/', function(req,res,next) {
	let game=new model.model.Game();
  model.model.games.push(game);
  console.log(game.getId());
  game=JSON.stringify(game);
  res.status(200).json(game);
});
app.use('/getPlayer/', function(req,res,next) {
	let player = new model.model.Player();
  model.model.players.push(player);
  console.log(game.getId());
  player=JSON.stringify(player);
	res.status(200).json(player);

});
