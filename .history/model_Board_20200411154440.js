
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

let count = 0;

/**
 * Array With Current State
 */
var currState = [];
for (var i = 0; i < height; i++) {
    currState[i] = [];
    for (var j = 0; j < width; j++) {
        //currState[i].push(true); //default all true
        currState[i].push({
            state: true,
            col: i,
            row: j,
            type: "alarm"
        })
        if(i % 2 && j % 2) {
            currState[i].push({
                type: gem
            })
        }
    }
}
console.log(currState);

// var arr = [];
// for (var i = 0; i < height; i++) {
//     arr.push({
//         key: count,
//         sortable: true,
//         resizeable: true
//     });
//     count++;
// }

// console.log(arr);


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

            if (currState[i][j].state == true) {
                if (j % 2 && i % 2) { //identify gem cells
                    //currentState[0].push(cell);
                    cell.innerHTML = gemChar;
                    cell.className = "gem";
                }
                else if (j % 2 || i % 2) { //identify alarm cells
                    cell.className = "alarm";
                    cell.addEventListener('click', function (event) {
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
    let currRow = event.target.getAttribute("row"); //curr row from event listener and table
    let currCol = event.target.getAttribute("col"); //curr col from event listener and table
    let gemsFound = [];

    let row = currState[currRow][currCol].row;
    let col = currState[currRow][currCol].col;

    currState[currRow][currCol].state = (false);
    console.log(currState[currRow][currCol]);

    //Temporary variables to hold surrounding cells
    let leftCell;
    let rightCell;
    let upCell;
    let downCell;

    let alarmsAroundGemsFound = [];

    //Check if surrounding are gems
    if (row - 1 >= 0) {
        upCell = currState[row - 1][col];
        if ((row - 1) % 2 && col % 2) {
            gemsFound.push(upCell);
        }
    } //worked


    console.log(gemsFound);
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
