var game = new Phaser.Game(2500, 800, Phaser.AUTO, '', 
{ preload: preload, create: create, update: update });

function preload()
{
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('portrait', 'assets/portrait.jpg');
}

var player;                     // Player object
var isak;
var speed = 350;                // Speed of the player

var numberOfStudents = 10;      // Total number of students, including player
var studentSpace = 35;          // Space between students

var studentArray = new Array(); // Array holding students, including player
                                // Does not change during game!

var train = new Array();        // The train array
var trainPath = new Array();    // Contains Points which the train moves along
var spacePoints = 5;            // Number of Points between students

var spaceKey;                   // Spacebar reference

//*** NATION CONSTRUCTOR ***
function Nation(sprite) {
    
    this.sprite = sprite;
    this.isOpen = true;
    
    this.close = function() {
        this.isOpen = false;
    }
}

function create()
{
    // Enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Create references to the cursor-keys and the spacebar
    cursors = game.input.keyboard.createCursorKeys();
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // Blocks the browser from listening to the keys we want to use
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, 
        Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
    
    
          
    //*** INITIALIZE PLAYER ***
    player = new Student(game.add.sprite(game.world.width/2,game.world.height/2,
    'dude'));
    player.sprite.scale.setTo(0.8,0.8); // Adjusts scale of sprite
    player.sprite.anchor.setTo(0.5,0.5); // Set reference to center of sprite
    game.physics.arcade.enable(player.sprite); // Enable physics for player
    
    // Adds animation to player
    player.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    player.sprite.animations.add('right', [5, 6, 7, 8], 10, true); 
    
    player.addToTrain();
    
    //*** INITIALIZE TRAIN PATH ***
    // I don't understand what this does but it works...
    var numberOfPoints = (numberOfStudents*spacePoints-1);
    for (var i=1; i <= numberOfPoints; i++) {
        trainPath[i-1] = new Phaser.Point(player.sprite.x, 
        player.sprite.y+(i*studentSpace)/spacePoints)
    }
    
    //*** INITIALIZE REST OF STUDENTS ***
    for (var i=1; i < numberOfStudents; i++) {
                
        studentArray[i] = new Student(game.add.sprite(player.sprite.x, 
    trainPath[i*spacePoints].y, 'dude'));
    
        var thisStudent = studentArray[i];
        // Add random tint to sprite to help identify separate students
        thisStudent.sprite.tint = Math.random() * 0xffffff;
        
        thisStudent.sprite.scale.setTo(0.8,0.8);
        thisStudent.sprite.anchor.setTo(0.5,0.5);
    
        thisStudent.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        thisStudent.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        thisStudent.addToTrain();       
    }
    
}

    var spacer = 0;

function update()
{
    player.sprite.body.velocity.setTo(0,0);
    
    if (spaceKey.downDuration(1) && train.length > 1) {
        train[train.length-1].removeFromTrain();
        isak = game.add.sprite(200+spacer, 400, 'portrait');
        isak.scale.setTo(0.3, 0.3);
        game.physics.arcade.enable(isak);
    
        isak.body.immovable = true;
        
        spacer += 150;
    }
    
    var hitIsak = game.physics.arcade.collide(player.sprite, isak);
    
    
    if (cursors.up.isDown) {
        player.sprite.body.velocity.y = -speed;
        updateTrain();
    }
    else if (cursors.down.isDown) {
        player.sprite.body.velocity.y = speed;
        updateTrain();
    }
    else if (cursors.left.isDown) {
        player.sprite.body.velocity.x = -speed;
        player.sprite.animations.play('left');
        updateTrain();
    }
    else if (cursors.right.isDown) {
        player.sprite.body.velocity.x = speed;
        player.sprite.animations.play('right');
        updateTrain();
    }
    else {
        player.sprite.frame = 4;
    }
    
    for (var i=1; i < numberOfStudents; i++) {
    var thisStudent = studentArray[i];
        if (!(thisStudent.isInTrain)) {
            var xDist = Math.abs(player.sprite.x - thisStudent.sprite.x);
            var yDist = Math.abs(player.sprite.y - thisStudent.sprite.y);
            
            if (Math.sqrt(xDist*xDist + yDist*yDist) < 20) {
                thisStudent.addToTrain();
            }
        }
    }
}

function updateTrain() {
    
    // Do not update train if collision is detected
    if (!(player.sprite.body.wasTouching.none)) {
            return;
    }
    
    // Everytime the player moves,
    // knock the last train Point off the end
    // and insert the new location at the start of the array
        
    var point = trainPath.pop(); // Remove point at the end
    
    point.setTo(player.sprite.x, player.sprite.y); // Move point to start
    
    trainPath.unshift(point); // Insert point at start of trainPath array
    
    // I don't understand what this does but it works...
    for (var i=1; i < train.length; i++) {
        train[i].sprite.x = trainPath[i*spacePoints].x;
        train[i].sprite.y = trainPath[i*spacePoints].y;
    }
}

