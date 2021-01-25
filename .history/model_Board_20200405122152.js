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

/**
 * Function to Draw Board
 */
function drawBoard() {
    var table = document.createElement("table");
    for (var i = 0; i < height; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < width; j++) {
            var cell = document.createElement('td');
            currentState[i].push(cell);
            if (j % 2 && i % 2) { //identify gem cells
                //currentState[0].push(cell);
                cell.innerHTML = gemChar;
                cell.className = "gem";
                //move event listener to turn handler function
                cell.addEventListener('click', function(event){
                    this.innerHTML  = "name";
                    //replay.enqueue(this);
                })
            }
            else if (j % 2 || i % 2) { //identify alarm cells
                cell.className = "alarm";
                arr.push(cell);
                cell.addEventListener('click', function(event){
                    this.className = "grey";
                    //replay.enqueue(this);
                })
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

// arr[i].addEventListener('click', function () {    
//     const color = document.querySelector('#colorPicker').value;
//     arr[i].style.backgroundColor = color;
//   });

drawBoard();

//redraw board
// function captureAlarms() {
//     for (var i = 0; i < currentState.length; i++) {
//         for (var j = 0; j < currentState[i].length; j++) {
//             if (j % 2 || i % 2) { //identify alarm cells
//                 //event listener 
//                 //if clicked - change col.classname (access from array?)
                
//             }
//         }
//     }
// }

// function captureGems() {

// }

function determineWinner() {
    
}

function reDraw() {

}