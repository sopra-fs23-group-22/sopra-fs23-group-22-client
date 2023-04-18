class Piece {
    constructor(data = {}) {
      this.pieceType = "bomb";
      this.armyType = null;
      this.aliveState = null;
      Object.assign(this, data);
    }
  }
  export default Piece;