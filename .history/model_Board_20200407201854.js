/**
 * Variables
 */
const width = 7;
var gemChar = '&#128142';
var noGems = document.getElementById("myRange").value;
height = (2 / 3 * noGems) + 1;

/**
 * Declare Arrays for Drawing Board...
 */
var pieces = [];
for (var i = 0; i < height; i++) {
    pieces[i] = [];
}

var currState = [];
for (var i = 0; i < height; i++) {
    currState[i] = [];
}

//array of state of board


/**
 * Function to Draw Board
 */
function drawBoard() {
    var table = document.createElement("table");
    for (var i = 0; i < height; i++) { //loop through height
        var row = document.createElement('tr'); //create rows for each height
        for (var j = 0; j < width; j++) { //loop through width
            var cell = document.createElement('td'); //create columns for each width
            //bind ids to cells [i][j]
            pieces[i].push(cell);
            currState[i].push(true);
            cell.setAttribute("row", i);
            cell.setAttribute("col", j);
            //Identify Gem Cells
            if (j % 2 && i % 2) {
                cell.innerHTML = gemChar;
                cell.className = "gem";
                //example - move out later to follow after alarm captured
                cell.addEventListener('click', function (event) { //disable after clicked + how to pass row and col
                    this.innerHTML = "name";
                })
            }
            //Identify Alarms
            else if (j % 2 || i % 2) {
                cell.className = "alarm";
                cell.addEventListener('click', function (event) { //disable after clicked + how to pass row and col
                    this.className = "white";
                    captureAlarm(this);
                    event.preventDefault();
                })
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);

    //display in this div
    let divContainer = document.getElementById("game");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

drawBoard();

function captureAlarm() {
    let currRow = event.target.getAttribute("row"); //curr row
    let currCol = event.target.getAttribute("col"); //curr col
    let alarmsAroundEvent = [];
    let gemsFound = [];
    let leftCell;
    let rightCell;
    let upCell;
    let downCell;
    let one = 1;
    let alarmsAroundGemsFound = [];

    currState[currRow][currCol] = (false); //bind false to cell.className = "white";
    //add move to replay

    if (currRow - 1 >= 0) {
        upCell = pieces[currRow - 1][currCol];
        alarmsAroundEvent.push(upCell);
    } if (currCol - 1 >= 0) {
        leftCell = pieces[currRow][currCol - 1];
        alarmsAroundEvent.push(leftCell);
    // } if (currRow + 1 < height) {
    //     downCell = pieces[currRow+1][currCol];
    //     alarmCheck.push(downCell);
    // } if (currCol < width) {
    //     rightCell = [currRow][currCol+1];
    //     alarmCheck.push(rightCell);
    }

    console.log(upCell);
    console.log(leftCell);
    console.log(alarmsAroundEvent);
    //}

    //loop 1 find gems around alarms
    for (let i = 0; i < alarmsAroundEvent.length; i++) {
        if (alarmsAroundEvent[i].className == "gem") {
            gemsFound.push(alarmsAroundEvent[i]);
        }
    }

    //loop 2 - check for alarms around each gem to see if gem should be captured
    for (let i = 0; i < gemsFound.length; i++) {
        let gemRow = gemsFound[i].getAttribute("row");
        let gemCol = gemsFound[i].getAttribute("col");

        let alarmUp = (pieces[gemRow - 1][gemCol]);
        let alarmLeft = (pieces[gemRow][gemCol - 1]);
        //let alarmRight = (pieces[gemRow + 1][gemCol]);
        //let alarmDown = (pieces[gemRow + 1][gemCol]);

        alarmsAroundGemsFound.push(alarmUp, alarmLeft);

        for (let j = 0; j < alarmsAroundGemsFound.length; j++) {
            if (alarmsAroundGemsFound[i].className == "white") {
                alarmsAroundGemsFound.pop[i];
            }
        }
        console.log(alarmsAroundGemsFound);

        if (alarmsAroundGemsFound.length == 0) {
            gemsFound.className = "white";
            gemsFound.innerHTML = "name";
            //add move to replay
            //currState[gemRow][gemCol] = (false);
            //model.Player.score++;
            declareWinner();
        }
        else {
            //Next Turn
        }

    }

}

function declareWinner() {
    let gemsToWin = player.length / noGems;
    if (player.score = gemsToWin) {
        //alert
        //kill game
        //update leagueboard
    }
    else {
        //next turn
    }
}
