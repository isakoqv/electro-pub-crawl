// The student constructor
function Student(sprite) {
    
    this.sprite = sprite;       // The student sprite
    this.isInTrain = false;
    this.alcLevel = 0;
    
    // Adds the student to the train array
    this.addToTrain = function() {
        train.push(this);
        this.isInTrain = true;
    } 
    // Removes the student from the train array
    this.removeFromTrain = function() {
        const index = train.indexOf(this);
        train.splice(index, 1);
        this.isInTrain = false;
    }
    // Increases alcLevel and returns points dependent on drinkType
    this.drink = function(drinkType) {
        if (drinkType === "beer") {
            var min = 5;
            var max = 10;
            var points = 10;
        }
        else if (drinkType === "shot") {
            var min = 10;
            var max = 20;
            var points = 20;
        }
        this.alcLevel = Math.floor(Math.random()* (max - min + 1 ) + min);
        
        return points;        
    }
    // Makes the student talk
    this.talk = function() {
    
    }
    // Makes the student engage in a random drunken activity
    this.becomeDrunk = function() {
        
    }
}