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
            //pieces[i][j].addEventListener(MouseEvent.CLICK, captureAlarm([i][j]));
            if (j % 2 && i % 2) { //identify gem cells
                cell.innerHTML = gemChar;
                cell.className = "gem";
                //console.log(i,j);
                let currRow = i;
                let currCol = j;
            }
            else if (j % 2 || i % 2) { //identify alarm cells
                cell.className = "alarm";
                cell.addEventListener('click',function(event){ //disable after clicked + how to pass row and col
                    console.log(i,j);
                    captureAlarm(currRow,currCol);
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
    // console.log(event.target);
    // console.log(event);
    // console.log(this);
    //console.log(pieces[i]);
    //console.log(pieces.indexOf);
    //let currPiece = event.target; //this is just the piece not array position
    //console.log(currPiece);
    
}


