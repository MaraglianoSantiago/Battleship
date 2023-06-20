let view = {
    // this method takes a string message and displays it
    // in the message display area
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
   };

let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,

    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] } ],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
            } else if (index >= 0){
                    ship.hits[index] = "hit";
                    view.displayHit(guess);
                    view.displayMessage("HIT!");

                    if(this.isSunk(ship)){
                        view.displayMessage("You sank my battleship");
                        this.shipsSunk++;
                    }
                    return true; 
                }    
            }
        view.displayMiss(guess);
        view.displayMessage("You missed.");    
        return false;   
        },

    isSunk: function(ship){
        for (let i = 0; i <this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
     },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: "); 
		console.log(this.ships); //here we display the current values for the ship locations in the console 
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2); //Math.floor(Math.random() * 2); //generate a random type of direction
        let row;
        let col;
        if (direction === 1) {
            //Below i make sure that the first row location for the ship is optimal for the ship to be
            // inside the board
            row = Math.floor(Math.random() * this.boardSize);                                                                        
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); 
        } else {
            //Same here to make sure the ship dimensions don't scape the boardsize            
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); 
            col = Math.floor(Math.random() * this.boardSize);                         
        }

        let newShipLocations = [];
        for(let i = 0; i < this.shipLength; i++){
            if (direction === 1){
                newShipLocations.push(row + "" + (col + i)); //here the values are transformed to string type using ""
            } else {
                newShipLocations.push((row + i) + "" + col);                
            }
        }
        return newShipLocations;
    },

    collision : function(locations){                    
       for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0){//this could be !== -1 too
                return true;
                }
            }
       }
       return false;
    }    
    
    };

let controller = {
    guesses: 0,

    processGuess: function(guess){
        let location = parseGuess(guess);
        if (location){
            this.guesses++;
            let hit = model.fire(location); //this could be true or false
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, in ${this.guesses} guesses`);
        }
    }
  }
}
//*Now let's use some functions 

//Below there's a function to valid the guess of the user
function parseGuess(guess){
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
    
        if (guess === null || guess.length !== 2){
            view.displayMessage("Oops, please enter a letter and a number on the board");
         } else {
            let firstChar = guess.charAt(0); //!here i can add a firstChar.toUpperCase to make sure when entered a lowercase it is a valid guess       
            firstChar = firstChar.toUpperCase();
            let row = alphabet.indexOf(firstChar);
            let column = guess.charAt(1); //String type value
            
            if (isNaN(row) || isNaN(column)) { //I think that inNan(row) isn't necesary
                                                //cause indexOf is always going to return a number
                view.displayMessage("Oops, that isn't on the board.");
                } 
            else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                view.displayMessage("Oops, that's off the board!");
                }
              else{
                return row + column; 
              }
        }
        return null;
    }

    //!processGuess can't take a lowercase character as valid for now.

    function handleFireButton() {
        let guessInput = document.getElementById("guessInput");
        let guess = guessInput.value; //Not totlly sure how this works
        controller.processGuess(guess);
        guessInput.value = ""; //Without this line, the UI will still show the guess in the dialogue box even after it is entered.
        }

    function handleKeyPress(e) {
        let fireButton = document.getElementById("fireButton");
        if (e.keyCode === 13) {
            fireButton.click(); //This is our way to press the fire button from the coding
            return false;
           }
        }

    window.onload = init;

    function init() {
        // Fire! button onclick handler
	    let fireButton = document.getElementById("fireButton");
	    fireButton.onclick = handleFireButton;

	    // handle "return" key press
	    let guessInput = document.getElementById("guessInput");
	    guessInput.onkeypress = handleKeyPress;

	    // place the ships on the game board
	    model.generateShipLocations();

        }

    
/*
? To disallow the player to enter more guesses after the game is over,
? i would hide the button to enter the guesses. I thinks that this is done
? by calling a method from the DOM to do it.

* also have to do something when entered a value that already missed
* it is counted as a valid entry 
*/

    


    

    
    
    