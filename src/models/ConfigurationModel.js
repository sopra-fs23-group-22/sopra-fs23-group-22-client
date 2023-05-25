import GamePiece from "./GamePiece";

class ConfigurationModel {
  constructor(armyType) {
    const redConfig = [
      [null, null, "LAKE", "LAKE", null, null, "LAKE", "LAKE", null, null],
      ["marshal", "general", "colonel", "colonel", "major", "major", "major", "captain", "captain", "captain"],
      ["captain", "lieutenant", "lieutenant", "lieutenant", "lieutenant", "sergeant", "sergeant", "sergeant", "sergeant", "miner"],
      ["miner", "miner", "miner", "miner", "scout", "scout", "scout", "scout", "scout", "scout"],
      ["scout", "scout", "spy", "bomb", "bomb", "bomb", "bomb", "bomb", "bomb", "flag"]
    ];

    const blueConfig = this.mirror(redConfig);
    this.armyType = armyType;
    this.configuration = armyType === 'red' ? redConfig : blueConfig;
  }

  swapPieces(source, target) {
    const temp = this.configuration[source[0]][source[1]];
    this.configuration[source[0]][source[1]] = this.configuration[target[0]][target[1]];
    this.configuration[target[0]][target[1]] = temp;
  }

  getPieces() {
    const pieces = [];
    for (let i = 0; i < this.configuration.length; i++) {
      for (let j = 0; j < this.configuration[i].length; j++) {
        const type = this.configuration[i][j];
        if (type !== null && type !== 'LAKE') {
          pieces.push(new GamePiece(type, this.armyType));
        }
      }
    }
    return pieces;
  }

  mirror(pattern) {
    const mirroredPattern = [];
    for (let i = 4; i >= 0; i--) {
      mirroredPattern.push(pattern[i].slice().reverse());
    }
    return mirroredPattern;
  }
}

export default ConfigurationModel;