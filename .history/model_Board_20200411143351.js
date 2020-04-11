
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

/**
 * Array With Current State
 */
var currState = [];
for (var i = 0; i < height; i++) {
    currState[i] = [];
    for (var j = 0; j < width; j++) {
        let trueVar = true;
        currState[i].push(trueVar); //default all true
    }
    currState.forEach(function(item, index, array) {
        addEventListener('click', function (event) {
            let row = i.setAttribute("row",i);
            //find row and col of currState
            this.className = "white";
            //captureAlarm();
        })
      });
}


/**
 * Function to Draw Board depending on whether values are true / false
 */
function drawBoard() {
    //Create rows and tables according to specified height and width
    var table = document.createElement("table");
    for (var i = 0; i < height; i++) { //loop through height
        var row = document.createElement('tr'); //create rows for each height
        for (var j = 0; j < width; j++) { //loop through width
            var cell = document.createElement('td'); //create columns for each width
            pieces[i].push(cell);
            cell.setAttribute("row", i);
            cell.setAttribute("col", j);

            if (currState[i][j] == true) {
                if (j % 2 && i % 2) { //identify gem cells
                    //currentState[0].push(cell);
                    cell.innerHTML = gemChar;
                    cell.className = "gem";            
                }
                else if (j % 2 || i % 2) { //identify alarm cells
                    cell.className = "alarm";
                    cell.addEventListener('click', function (event) {
                        //find row and col of currState
                        this.className = "white";
                        captureAlarm();
                    })
                }
            }
            else {
                cell.className = "white"
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

//free of HTML elements
function captureAlarm() {
    let currRow = event.target.getAttribute("row"); //curr row
    let currCol = event.target.getAttribute("col"); //curr col
    let gemsFound = [];

    //Temporary variables to hold surrounding cells
    let leftCell;
    let rightCell;
    let upCell;
    let downCell;

    let alarmsAroundGemsFound = [];

    currState[currRow][currCol] = (false);

    //Check if surrounding are gems
    if (currRow - 1 >= 0) {
        if ((currRow-1) % 2 && currCol % 2) {
            upCell = currState[currRow - 1][currCol];
            console.log(upCell);
            gemsFound.push(upCell); //successfully pushes true but not row and col
            //}
        }
    }
    //console.log(gemsFound);
    console.log(upCell);

    if (currCol - 1 >= 0) {
        leftCell = pieces[currRow][currCol - 1];
        if (leftCell.className == "gem") {
            gemsFound.push(leftCell);
        }
    }
    if (currRow < height - 1) {
        downCell = pieces[parseInt(currRow) + 1][currCol];
        if (downCell.className == "gem") {
            gemsFound.push(downCell);
        }
    }
    if (currCol < width - 1) {
        rightCell = pieces[currRow][parseInt(currCol) + 1];
        if (rightCell.className == "gem") {
            gemsFound.push(rightCell);
        }
    }

    console.log(pieces);

    //loop 2 - check for alarms around each gem to see if gem should be captured
    //empty array or create new array for each gem

    for (let i = 0; i < gemsFound.length; i++) {
        let gemRow = gemsFound[i].getAttribute("row"); //new GemRow
        let gemCol = gemsFound[i].getAttribute("col"); //new GemCol

        upCell = (pieces[gemRow - 1][gemCol]);
        if (upCell.className == "alarm") {
            alarmsAroundGemsFound.push(upCell);
        }
        leftCell = (pieces[gemRow][gemCol - 1]);
        if (leftCell.className == "alarm") {
            alarmsAroundGemsFound.push(leftCell);
        }
        downCell = pieces[parseInt(gemRow) + 1][gemCol];
        if (downCell.className == "alarm") {
            alarmsAroundGemsFound.push(downCell);
        }
        rightCell = (pieces[gemRow][parseInt(gemCol) + 1]);
        if (rightCell.className == "alarm") {
            alarmsAroundGemsFound.push(rightCell);
        }

        console.log(alarmsAroundGemsFound);

        //if the array is empty after removing all surrounding gems
        if (alarmsAroundGemsFound.length == 0) {
            gemsFound.className = "white"; //turn the gemFound to white
            gemsFound.innerHTML = "name"; //place the name inside
            //add move to replay
            currState[gemRow][gemCol] = (false);
            //model.Player.score++; //update score
            console.log(alarmsAroundGemsFound);
            alarmsAroundGemsFound = [];
            console.log(alarmsAroundGemsFound);
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
