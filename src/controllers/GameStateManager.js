class GameStateManager {
  // Manages different game states and transitions between them.
  constructor() {
    this.currentState = null;
    this.states = {
      StartScreen: new StartScreen(),
      ConfigMenu: new ConfigMenu(),
      Instruction: new Instruction(),
      Gameplay: new Gameplay(),
      EndScreen: new EndScreen()
    };
    this.changeState('StartScreen');
  }

  changeState(newState) {
    if (this.states[newState]) {
      this.currentState = this.states[newState];
      this.currentState.init();
    } else {
      console.error(`GameState ${newState} does not exist.`);
    }
  }

  update() {
    if (this.currentState) {
      this.currentState.update();
    }
  }

  render() {
    if (this.currentState) {
      this.currentState.render();
    }
  }

  handleInput(input) {
    if (this.currentState) {
      this.currentState.handleInput(input);
    }
  }
}