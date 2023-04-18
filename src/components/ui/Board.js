import React from 'react'
import 'styles/ui/Board.scss'
import Tile from './Tile'
import Piece from 'models/Piece'


const verticalAxis = ["1","2","3","4","5","6","7","8","9","10"]
const horizontalAxis = ["A","B","C","D","E","F","G","H","I","J"]


const Board = () => {

    let board = [];
    for(let j=verticalAxis.length - 1; j>=0; j--) {
        for(let i=0; i<horizontalAxis.length; i++) {
            let number = i+j+2;
            board.push(<Tile value={number} image = "images/stratego-bomb.svg"/>)
            // board.push(<Tile value={number} src = "images/stratego-bomb.svg"/>)
        }
    }

  return (
  <div className='board'>{board}</div>
  );   
};

export default Board;

