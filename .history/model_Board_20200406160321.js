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

var eventListenerArray = [];
for (var i = 0; i < height; i++) {
    eventListenerArray[i] = [];
}

/**
 * Function to Draw Board
 */
function drawBoard() {
    var table = document.createElement("table");
    for (var i = 0; i < height; i++) { //loop through height
        var row = document.createElement('tr'); //create rows for each height
        for (var j = 0; j < width; j++) { //loop through width
            var cell = document.createElement('td'); //create columns for each width
            pieces[i].push(cell);
            cell.setAttribute("row", i);
            cell.setAttribute("col", j);

            //Identify Gem Cells
            if (j % 2 && i % 2) {
                cell.innerHTML = gemChar;
                cell.className = "gem";
            }
            //Identify Alarms
            else if (j % 2 || i % 2) {
                cell.className = "alarm";
                cell.addEventListener('click', function (event) { //disable after clicked + how to pass row and col
                    this.className = "white";
                    captureAlarm();
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
    console.log(currRow,currCol);
    if (currRow-1 == gemChar) {
        console.log("true");
    }
    console.log(event.target);
}