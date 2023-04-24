// import Board from 'components/ui/Board';
import React, {useEffect, useState} from "react";
import Frame from 'components/ui/Frame';
import 'styles/views/OngoingGame.scss';
import {api} from "../../helpers/api";
import { Spinner } from 'components/ui/Spinner';
import Square from "components/ui/Square";
import 'styles/ui/Board.scss'
import SquareModel from "models/SquareModel";
import Piece from "components/ui/Piece";


const Board = ({target}) => {

  let pieceBeingDragged;

  const handlePieceDragStart = (e) => {
    console.log("dragging");
    pieceBeingDragged = e.target
  }

  const handleSquareDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.target.setAttribute("data-draggable", true);
  }

  const handleSquareDrop = (e) => {
    e.preventDefault();
    const droppedSquare = e.target;
    console.log(droppedSquare.querySelector('.piece'));
    droppedSquare.append(pieceBeingDragged);
    console.log(e.target);
  }

    let gameBoard = [];

  for(let i=0; i<10; i++) {
      for(let j=0; j<10; j++) {
          const pieceId = j + i * 10;
          const targetPiece = target[pieceId];
          const pieceType = targetPiece.piece.pieceType.toLowerCase();
          const army = targetPiece.piece.armyType.toLowerCase();
          const piece = null;

          if(targetPiece.type==="BATTLE_FIELD") {
            piece = pieceType !== null? 
            (<Piece
              id = {`piece-${pieceId}`}
              class = 'piece'
              type={pieceType} 
              army={army} 
              draggable
              onDragStart = {handlePieceDragStart}
              />) 
                : null;
            gameBoard.push(
              <Square 
                class="square"
                key={pieceId}
                value={i + j + 2}
                content={piece}
                onDragOver = {handleSquareDragOver}
                onDrop = {handleSquareDrop}
              />
            );
          } else {
            gameBoard.push(
              <Square 
                key={pieceId}
                value={i + j + 2}
                content={piece}
                type={"LAKE"}
              />
            );
          }
        }
  }

  return (
  <div className='board'>{gameBoard}</div>
  );   
};

const OngoingGame = () => {

  const [board, setBoard] = useState([]);

  useEffect(() => {
    // console.log("running use effect");
    async function fetchData() {
      try {
        const response = await api.get('/boards');
        setBoard(response.data);
      } catch(error) {
        alert("Something went wrong while fetching the game! See the console for details.")
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log(`board changed: ${JSON.stringify(board)}`);
  // }, [board]);

  let content = <Spinner/>;
  if(board.length!==0 & board!==undefined) {
    // console.log("checking board")
    let convertedBoard = convertToSquares(board);
    // console.log(convertedBoard); // Check if convertedBoard is defined
    content = <Board target={convertedBoard}/>
  }

  function convertToSquares(targetBoard) {
    // console.log(targetBoard); // Check if targetBoard is defined
    const squareList = [];
    for (let i = 0; i < targetBoard.length; i++) {
      let square = new SquareModel(
        targetBoard[i].axisX,
        targetBoard[i].axisY,
        targetBoard[i].type,
        targetBoard[i].content
      );
      squareList.push(square);
    }
    return squareList;
  }

  return (
    <Frame>
      <div className='ongoingGame container'>
        {content}
      </div>
    </Frame>
  );
}

export default OngoingGame;