class EnemyShip {
  constructor(model, texture) {
    this.model = model;
    this.texture = texture;
    this.x = random(-gamingZone.width / 3, gamingZone.width / 3);
    this.y = random(-gamingZone.height / 3, gamingZone.height / 3);
    this.z = random(-5000, -5200); // Start off-screen
    this.rotationZ = 0;
    this.speed = 8;
    this.changeDirectionInterval = 1000; // milliseconds
    this.lastDirectionChange = millis();
    this.direction = createVector(random(-0.5, 0.5), random(-0.5, 0.5), random(0.5, 1));
    this.colliderRadius = 80; // radius for collision detection
    this.health = 50; 
    this.state = null; // flag for taking damage
    this.laserCooldown = 500; // milliseconds
    this.lastLaserTime = null;
  }

  update() {
    let currentTime = millis();
    if (currentTime - this.lastDirectionChange > this.changeDirectionInterval) {
      this.direction = p5.Vector.limit(p5.Vector.random3D(), 0.75);
      this.direction.z = constrain(this.direction.z, 1, 3); // Ensure forward movement to be faster
      this.lastDirectionChange = currentTime;
    }

    // Update position
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    this.z += this.direction.z * this.speed;
    
    // Constrain position within the collision zone
    this.x = constrain(this.x, -gamingZone.width / 3, gamingZone.width / 3);
    this.y = constrain(this.y, -gamingZone.width / 3, gamingZone.width / 3);
    
    // Update rotation based on direction
    this.rotationZ = constrain(this.rotationZ + map(this.direction.x, -1, 1, -PI / 2, PI / 2) * 0.01, -PI / 8, PI / 8);
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.rotationZ);
    // texture(this.texture);
    fill('red');
    // stroke(1);
    noStroke();
    if (this.state == 'takingDamage') {
      emissiveMaterial(252, 252, 252);
      this.state = null;
    }
    shininess(100);
    model(this.model);
    pop(); 
  }
  
  aimPlayer() {
    return ((abs(this.x - game.player.x) < 80 && 
            abs(this.y - game.player.y) < 80) &&
            abs(this.z - game.player.z) > 1000);
  }
  
  canFire() {
    let currentTime = millis();
    return (currentTime - this.lastLaserTime) > this.laserCooldown;
  }
  
  fireLaser() {
    if (this.canFire()) {
      this.lastLaserTime = millis();
      // Play laser sound
      soundManager.playSound('laserFire');
      // Create and return a new EnemyLaser instance
      return new EnemyLaser(this.x, this.y, this.z);
    }
    return null;
  }

  isOutOfBounds() {
    return this.z > 310; // Assuming camera is at z = 0
  }

  takeDamage(amount) {
    game.eventLog.push('Enemy got hit!');
    this.health -= amount;
    this.state = 'takingDamage';
    if (this.health <= 0) {
      this.destroy();
      return true; // Indicates that the ship was destroyed
    }
    soundManager.playSound('collision');
    return false;
  }

  destroy() {
    game.eventLog.push('Enemy destroyed!');
    // Play destruction sound
    soundManager.playSound('destruction');
    // Additional destruction effects can be added here
    this.toDelete = true;
    // Increase score or handle other game logic
    game.score += 200;
    game.eDestroyed ++;
  }
}