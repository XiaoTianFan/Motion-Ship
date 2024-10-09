class Instruction {
  constructor() {
    this.instructions = "=========CENTER YOUR FACE=========\n\nCommands\n\nHead Motion : Spaceship Direction\nSPACE : Fire Laser\nX : Tactic Engine (One Time)\nQ : Quit Current Mission\n\n\nGame Objective\n\n1. Destroy Any Obstacles\n2. Avoid Clashing With Them\n\n\nPress SPACE To Start";
  }

  init() {
    game.instructionShowed = true;
  }

  update() {
    //
  }

  render() {
    background(10);
    push();
    // translate(-windowWidth / 2, -windowHeight / 2, 0);
    // Code of this for loop comes from https://editor.p5js.org/ml5/sketches/lCurUW1TT
    // Draw all the tracked face points
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      for (let j = 0; j < face.keypoints.length; j++) {
        let keypoint = face.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(map(keypoint.x, 0, video.width, -width / 2, width / 2), 
               map(keypoint.y, 0, video.height, -height / 2, height / 2), 
               5);
      }
    }
    pop();
    push();
    translate(-windowWidth / 2 + windowWidth / 2 * 0.3, 0, 0);
    textAlign(LEFT, CENTER);
    textFont(assets.fonts.ps2p);
    fill(245);
    textSize(windowWidth / 48);
    text(this.instructions, 0, 0);
    pop();
  }

  handleInput(input) {
    if (input === 'keyPressed') {
        gameStateManager.changeState('Gameplay');
    }
  }
}