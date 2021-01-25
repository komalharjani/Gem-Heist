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
let currentState = new Array(height);
for (let k = 0; k < currentState.length; k++) {
    currentState[k] = new Array(width);
}
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
            var cell = document.createElement('td');
            //console.log(currentState[i][j]);
            if (j % 2 && i % 2) { //identify gem cells
                cell.innerHTML = gemChar;
                //console.log(i,j);
                cell.className = "gem";
                cell.onclick = function() {
                    //find closest gem
                    console.log(i,j);
                    // if (cell + i || cell + j || )
                    this.className = "white";

            }
        }
            else if (j % 2 || i % 2) { //identify alarm cells
                cell.className = "alarm";
                cell.onclick = function() {
                    //find closest gem
                    console.log(i,j);
                    // if (cell + i || cell + j || )
                    this.className = "white";

                  }
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);
    //console.log(arr);
    console.log(currentState);

    //display in this div
    let divContainer = document.getElementById("game");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
drawBoard();

// function captureAlarm() {
//     if (currentState.className == "alarm") {
//         cell.addEventListener('click', function(event){
//             this.className = "white";
//             //replay.enqueue(this);
//     })
// }
// }


//Array for Players

//Queue replay

//for logic implmeentation 
//seccond array? - to know which gems to check on
//gems array - to determine score and winner -- one for each player -- consider multiple players to determine winner
//how to pass html objects as a JSON ????

// drawTable = function(currentState) {
//         var table = document.createElement('table');
//         for (var i = 0; i < currentState.length; i++) {
//             var row = document.createElement('tr');
//             for (var j = 0; j < currentState[i].length; j++) {
//                 var cell = document.createElement('td');
//                 cell.textContent = currentState[i][j];
//                 row.appendChild(cell);
//             }
//             table.appendChild(row);
//         }
//         return table;
//     }
//     let divContainer = document.getElementById("game");
//     divContainer.innerHTML = "";
//     divContainer.appendChild(table);
//     drawTable();
