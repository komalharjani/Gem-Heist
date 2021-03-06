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
        currState[i].push(true); //default all true
    }
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
                    //move event listener to turn handler function
                    cell.addEventListener('click', function (event) {
                        this.innerHTML = "name";
                        captureAlarm();
                    })
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
    let currRow = event.target.getAttribute("row"); //curr row
    let currCol = event.target.getAttribute("col"); //curr col

    // let intRow = parseInt(currRow);
    // intRow += 1;
    // console.log(intRow);
    let widthminus = (width-1);

    let alarmsAroundEvent = [];
    let gemsFound = [];
    let leftCell;
    let rightCell;
    let upCell;
    let downCell;
    let one = 1;
    let alarmsAroundGemsFound = [];

    console.log(parseInt(currCol)-1);
    console.log(width-1);

    currState[currRow][currCol] = (false); //bind false to cell.className = "white";
    //add move to replay

    if (currRow - 1 >= 0) {
        upCell = pieces[currRow - 1][currCol];
        alarmsAroundEvent.push(upCell);
    }
    if (currCol - 1 >= 0) {
        leftCell = pieces[currRow][currCol - 1];
        alarmsAroundEvent.push(leftCell);
    }
    if (currRow < height-1) {
        downCell = pieces[parseInt(currRow) + 1][currCol];
        alarmsAroundEvent.push(downCell);
    }
    if (currCol < 6) {
        rightCell = pieces[currRow][parseInt(currCol) + 1];
        alarmsAroundEvent.push(rightCell);
    }

    console.log(upCell);
    console.log(leftCell);
    console.log(downCell);
    console.log(rightCell);
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
            let gemRow = gemsFound[i].getAttribute("row"); //new GemRow
            let gemCol = gemsFound[i].getAttribute("col"); //new GemCol

            let alarmUp = (pieces[gemRow - 1][gemCol]); 
            let alarmLeft = (pieces[gemRow][gemCol - 1]);
            let alarmDown = pieces[parseInt(gemRow) + 1][gemCol];
            let alarmRight = (pieces[gemRow][parseInt(gemCol) + 1]);

            //put cells around alarm into an array
            alarmsAroundGemsFound.push(alarmUp, alarmLeft, alarmDown, alarmRight);

            //loop through array and remove any white ones
            for (let j = 0; j < alarmsAroundGemsFound.length; j++) {
                if (alarmsAroundGemsFound[j].className == "white") {
                    alarmsAroundGemsFound.pop[j];
                }
            }
            console.log(alarmsAroundGemsFound);

            //if the array is empty after removing all surrounding gems
            if (alarmsAroundGemsFound.length == 0) {
                gemsFound.className = "white"; //turn the gemFound to white
                gemsFound.innerHTML = "name"; //place the name inside
                //add move to replay
                currState[gemRow][gemCol] = (false);
                //model.Player.score++; //update score
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

//2. fix the row and col
//3. reference errors with calling other functions in main


//turn into white
//borders