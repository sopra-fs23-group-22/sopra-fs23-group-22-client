import React from 'react'
import Frame from 'components/ui/Frame'
import Board from '../ui/Board'
import '../../styles/views/GamePreparing.scss'
import Square from 'components/ui/Square'
// import PieceSelector from 'components/ui/PieceSelector'
import Piece from 'components/ui/Piece'
import { useState } from 'react';
import GamePiece from 'models/GamePiece'

const pieceTypes = [[null, null, null, null, null, null, null, null, null, null], 
                    ["marshal", "general", "colonel", "colonel", "major", "major", "major", "captain", "captain", "captain"], 
                    ["captain", "lieutenant", "lieutenant", "lieutenant", "lieutenant", "sergeant", "sergeant", "sergeant", "sergeant", "miner"], 
                    ["miner", "miner", "miner", "miner", "scout", "scout", "scout", "scout", "scout", "scout"],
                    ["scout", "scout", "spy", "bomb", "bomb","bomb","bomb","bomb","bomb", "flag"]]



const DefaultBoard = () => {

  const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);
  let positionToBeSwapped = null;
  // store temporary position
  let temp = null;

  const handlePieceClick = (row, col) => {
    // if the first position is not selected yet
    if (selectedPiecePosition===null) {
      // assign the position to the variable
      setSelectedPiecePosition([row,col]);
    } else {
      // store the position of the other selected piece
      positionToBeSwapped = [row, col];
      // store the type of the other selected piece
      temp = pieceTypes[positionToBeSwapped[0]][positionToBeSwapped[1]];
      // swap the two piece
      pieceTypes[positionToBeSwapped[0]][positionToBeSwapped[1]] = pieceTypes[selectedPiecePosition[0]][selectedPiecePosition[1]];
      pieceTypes[selectedPiecePosition[0]][selectedPiecePosition[1]] = temp;
      // set the first posistion to be null again
      setSelectedPiecePosition(null);
    }
  };

  const board = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
      const pieceType = pieceTypes[i][j];
      const piece = pieceType !== null ? <Piece type={pieceType} army="red" onClick={() => handlePieceClick(i, j)} /> : null;
      board.push(<Square key={`${i}-${j}`} value={i + j + 2} content={piece} />);
    }
  }
  
  return (
    <div className='pregame defaultBoard'>{board}</div>
  )
}


const convertPieceTypeToPiece = ({pieceTypes}) => {
  const gamePiece = new GamePiece(pieceTypes, "red");
  return gamePiece;
}

const confirmBoard = () => {
  console.log(pieceTypes.length);
  const board = [];
  for(let i=1; i<pieceTypes.length; i++) {
    for(let j=0; j<pieceTypes[i].length; j++) {
      const gamePiece = new GamePiece(pieceTypes[i][j], "red");
      board.push(gamePiece);
    }
  }
  console.log(board);
}


const GamePreparing = () => {

  return (
    <Frame>
        <div className='pregame container'>
            <div className='pregame board-container'>
                <DefaultBoard/>
            </div>
            <button onClick={confirmBoard}>Confirm</button>
        </div>
    </Frame>
  )
}

export default GamePreparing;