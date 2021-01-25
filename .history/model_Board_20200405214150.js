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
            if (j % 2 && i % 2) { //identify gem cells
                cell.innerHTML = gemChar;
                cell.className = "gem";
            }
            else if (j % 2 || i % 2) { //identify alarm cells
                cell.className = "alarm";
                cell.addEventListener('click',function(event){ //disable when clicked
                    captureAlarm(event);
                    event.preventDefault();
                    this.className = "white";
                })
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);
    console.log(pieces[3][3]);
    //display in this div
    let divContainer = document.getElementById("game");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
drawBoard();

function captureAlarm() {
    let currPiece = event;
    if (pieces[0][1] == event) {
        console.log(true);
    }
    console.log(currPiece); //pulls out the event
    console.log("hello");
    //replay.enqueue(this);
}



