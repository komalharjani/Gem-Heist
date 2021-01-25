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

/**
 * Function to Draw Board
 */
drawBoard = function() {
    var table = document.createElement("table");
    for (var i = 0; i < currentState.length; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < currentState[i].length; j++) {
            var cell = document.createElement('td');
            pieces[i].push(cell); //push pieces into array
            if (j % 2 && i % 2) { //identify gem cells
                cell.innerHTML = gemChar;
                cell.className = "gem";
                cell.onclick = function() {
                  //alert("You cannot select this.");
                  this.innerHTML = "name";
                }
            }
            else if (j % 2 || i % 2) { //identify alarm cells
                cell.className = "alarm";
                cell.onclick = function() {
                  this.className = "white";
                  //enqueue this
                  //check if gem has surrounding
                }
            }
            else { //empty cells
                cell.className = "empty";
                cell.onclick = function() {
                  alert("You cannot select this.");
                }
            }
            
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);
    console.log(pieces);
    let divContainer = document.getElementById("game");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

function captureAlarm() {
    if (currentState.className == "alarm") {
        cell.addEventListener('click', function(event){
            this.className = "white";
            //replay.enqueue(this);
    })
}
}

function determineWinner() {
    
}

function reDraw() {

}