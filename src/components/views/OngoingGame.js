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
  console.log(target);
  let gameBoard = [];
  console.log(target.length);
      for(let j=0; j<10; j++) {
          for(let i=0; i<10; i++) {
              // const squareId = i+j*10;
              // const square = target[squareId];
              // gameBoard.push(<Square key={`${i}-${j}`} value = {i+j+2} content={square}/>)

              const pieceId = i + j * 10;
              const targetPiece = target[pieceId];
              const pieceType = targetPiece.piece.pieceType.toLowerCase();
              const army = targetPiece.piece.armyType.toLowerCase();
              const piece = null;
              if(targetPiece.type==="BATTLE_FIELD") {
                piece = pieceType !== null? <Piece type={pieceType} army={army}/> : null;
                gameBoard.push(<Square key={`${i}-${j}`} value={i + j + 2} content={piece}/>);
              } else {
                gameBoard.push(<Square key={`${i}-${j}`} value={i + j + 2} content={piece} type={"LAKE"}/>)
              }


              // console.log(piece);
              // gameBoard.push(<Square key={`${i}-${j}`} value={i + j + 2} content={piece}/>);
          
            }
      }
  return (
  <div className='board'>{gameBoard}</div>
  );   
};

const OngoingGame = () => {

  const [board, setBoard] = useState([]);

  useEffect(() => {
    console.log("running use effect");
    async function fetchData() {
      try {
        const response = await api.get('/boards');
        // await new Promise(resolve => setTimeout(resolve, 1000));
        setBoard(response.data);
        // console.log(`get data: ${response.data}`);
        // console.log(board)
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
    console.log("checking board")
    let convertedBoard = convertToSquares(board);
    console.log(convertedBoard); // Check if convertedBoard is defined
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