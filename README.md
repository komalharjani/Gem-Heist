# Gem Heist - students' practical for module cs5003 @ University of St Andrews CS
Gem Heist is a custom multi-player board game based around the classic Dots-and-Boxes game https://en.wikipedia.org/wiki/Dots_and_Boxes.

## Prerequisites
The game's clients or front-ends are meant to run in a web browser. They makes use of standard ES6 functionality and are compliant with all newer versions of modern browsers (Chrome, Edge, Firefox, Safari).
The game's server requires node.js. It was developed using node v8.9.4. It should be compatible with all versions of node that support ES6.
Express.js 4.17 is also required.
For a full list of all required packages please refer to "package.json".

## Rules of the Game
Players take turn to disable alarms that protect gems. Each gem is protected by four alarms. Each alarm can protect up to two gems. The player who disables the last alarm
protecting a gem collects the gem and gets to disable another alarm. The game is over once all the gems have been collected or once one player has collected more than half of the gems. The winner is the player who collects the most gems.

## Instructions to run
Cd into the game's root directory. Start the game's server with the command "node server.js".
In a browser (provided you run the game locally) type in http://localhost:3000/ to start a client. Since at least 2 players are needed to play the game you will need to start another client in a different tab, window or browser.

## Coding, reusability, maintainability
The server-side code is split into two files: model.js and server.js:  
**model.js** provides the three classes used to handle games, players and sessions. Including the game's logic
**server.js** starts and controls the program flow on the server-side. Provides all endpoints for the communication between clients and and the server
The client relies on three files: index.html, main.js and style.css all 
**index.html** basic html scaffolding for the game's web client
**style.css** styling and layout for the game's html 
**main.js** client-side code for the game (single-page-application) including an MVC structure

## Built With
ES6 object oriented javascript
Node.js
Express.js

## Contributing
This is a one-off practical for a University of St Andrews CS MSc program. Contributions will not be supported.

## Versioning
This is the version submitted in a first and only attempt to meet the practical's requirements.

## Authors
Max Wallraff
Koma Harjani
Project base and instructions by Ruth Letham

## Acknowledgments
Ruth Letham for guidance and support
Contributors to stackoverflow for many javascript related answers
