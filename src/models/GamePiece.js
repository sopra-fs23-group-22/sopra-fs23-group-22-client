class GamePiece {
    constructor(data = {type, army}) {
      this.pieceType = type;
      this.armyType = army;
      Object.assign(this, data);
    }
  }
  export default GamePiece;