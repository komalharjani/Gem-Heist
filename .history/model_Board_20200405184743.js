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
const drawBoard = function(Board) {
    var table = document.createElement("table");
    for (let row in Board) {
        let tr = document.createElement('tr');
        for (let col in Board[row]) {
            let td = document.createElement('td');
            td.innerHTML = Board[row][col];
            td.setAttribute("row",row);
            td.setAttribute("col",col);
            td.onclick = function() {
                if(board[row][col] == gemChar) {
                    itemClicked(this.getAttribute("row"), this.getAttribute("col"));
                    console.log("Gem Captured");                }
            }
            }
           
            
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);
    console.log(currentState);

    //display in this div
    let divContainer = document.getElementById("game");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
drawBoard();

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