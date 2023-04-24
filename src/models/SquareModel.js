const emptyPiece = {"pieceType": '', "armyType": ''};

class SquareModel {

    constructor(x, y, type, piece) {
        this.axisX = x;
        this.axisY = y;
        this.type = type;
        if(piece===null) {
            this.piece = emptyPiece;
        } else {
            this.piece = piece;
        }
    }
}

export default SquareModel;