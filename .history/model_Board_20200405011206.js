
/**
 * Variables
 */
const width = 7;
let noGems = 12; //change to based on user input
let height = (2/3 *noGems)+1; 
var gemChar = '&#128142';

//Declare new Array and generate table within array
let arr = new Array(height);
for (let k = 0; k < arr.length; k++) {
    arr[k] = new Array(width);
}

/**
 * Function to Draw Board
 */
function drawBoard() {
var table = document.createElement("table");
for (var i = 0; i < arr.length; i++) { 
    var row = document.createElement('tr'); 
    for (var j = 0; j < arr[i].length; j++) { 
        var col = document.createElement('td'); 
        if (j % 2 && i % 2) { //identify gem cells
            arr[0].push(col); //HELP --> need to push into array while retaining table structure
            col.innerHTML = gemChar;
            col.className = "gem";
        }
        else if (j % 2 || i%2) { //identify alarm cells
            col.className = "alarm";
            arr.push(col);
        }
        row.appendChild(col);
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



