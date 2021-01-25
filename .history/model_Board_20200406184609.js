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
console.log(pieces);

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
    let currPosition = pieces[currRow][currCol]; //current positon
    console.log(currPosition);
    console.log(pieces[currRow][currCol-1]); //+1 doesn't work

    //combinations
    let up = pieces[currRow-1][currCol];
    let down = pieces[currRow+1][currCol];
    let left = pieces[currRow][currCol-1];
    let right = pieces[currRow][currCol+1];
    let combos = [up, left, right, down];
    let gemsCount = 0;

    // for (let i=0; i < combos.length; i++) {
    //     console.log(combos[i]);

    // }

}
   


//Things to do now:
//1. Game Handler - only let one user select a cell at any given time and then disable for other player
// --- is this getTurn?
//2. Identify what objects are around currently selected alarm and implement logic for game with turn handler
//3. 

//Questions
//1. How to start server and get game started?