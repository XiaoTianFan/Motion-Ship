class Gameplay {
  // Manages the main gameplay loop, handling player actions, object interactions, and game logic.
  constructor() {
    this.background = null;
    this.hud = new HUD();
  }

  init() {
    // Initialize player with selected spaceship
    let selectedShip = configMenu.selectedShip || 'playerShip1';
    let playerModel = assets.models[selectedShip];
    let playerTexture = assets.textures[selectedShip];
    game.player = new Player(playerModel, playerTexture);

    // Initialize background
    let selectedBackground = configMenu.selectedBackground || 'background1';
    let backgroundTexture = assets.textures[selectedBackground];
    this.background = new Background(backgroundTexture);

    // Start background music
    soundManager.playSound('backgroundMusic', true); // Looping
    if (selectedBackground === 'background1') {
      soundManager.playSound('backgroundMusic1', true); // Looping
    } else if (selectedBackground === 'background2') {
      soundManager.playSound('backgroundMusic2', true); // Looping
    } else if (selectedBackground === 'background3') {
      soundManager.playSound('backgroundMusic3', true); // Looping
    } else if (selectedBackground === 'background4') {
      soundManager.playSound('backgroundMusic4', true); // Looping
    }
    
    // Update games played count
    dataManager.updateGamesPlayed();
    
    // Initialize object spawner
    objectSpawner = new ObjectSpawner();
    
    console.log('Gameplay initiated!');
  }

  update() {
    // Setup the macro lightning
    imageLight(this.background.texture);
    ambientLight(50);
    directionalLight(255, 255, 255, 0, 1, -0.8);

    // Update player based on head position
    let headPos = faceTracker.getHeadPosition();
    game.player.update(headPos);
    
    // Updarte background
    this.background.update(headPos.x, headPos.y);
    
    // Update event log
    this.logConstrain();

    // Handle sound-triggered laser firing
    if (keyIsPressed && game.player.canFire() && key === ' ') {
      let laser = game.player.fireLaser();
      if (laser) {
        game.laserBeams.push(laser);
      }
    }
    
    // Enemy fire laser when aimed
    for (let emy of game.enemies) {
      if (emy.aimPlayer()) {
        let laser = emy.fireLaser();
        if (laser) {
          game.enemyLaser.push(laser);
        }
      }
    }

    // Update and manage laser beams
    for (let laser of game.laserBeams) {
      laser.update();
      laser.checkCollision(game.objects, game.enemies);
    }
    game.laserBeams = game.laserBeams.filter(laser => !laser.toDelete);
    // Update and manage enemy laser beams
    for (let laser of game.enemyLaser) {
      laser.update();
      laser.checkCollision(game.objects); // The method in EnemyLaser also include check collision with Player
    }
    game.enemyLaser = game.enemyLaser.filter(laser => !laser.toDelete);

    // Update objects
    objectSpawner.update();
    objectSpawner.checkCollisions();
    
    // Update score based on ranning time
    if (frameCount % 10 == 0) {
      game.score += 1;
    }

    // Update score from object interactions
    this.score = game.score;

    // Update HUD
    this.hud.update(game.player.energy, this.score);
  }

  render() {
    // Render background
    this.background.render();

    // Render player
    game.player.render();

    // Render laser beams
    for (let laser of game.laserBeams) {
      laser.render();
    }
    
    // Render enemy laser beams
    for (let laser of game.enemyLaser) {
      laser.render();
    }

    // Render game objects
    objectSpawner.render();

    // Render HUD
    this.hud.render();
    
    // Render Notification
    globalNotification.render();
  }
  
  logConstrain() {
    if (game.eventLog.length > 6) {
      game.eventLog.splice(0, 1);
    }
  }
  
  handleInput(input) {
    if (input === 'Q' || input === 'q') {
      gameStateManager.changeState('EndScreen');
      console.log('Game ends!');
    } else if (input === 'X' || input === 'x') {
      game.player.tacticEngine();
    }
    
  }
}