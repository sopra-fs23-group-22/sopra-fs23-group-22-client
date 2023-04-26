// import Board from 'components/ui/Board';
import React, {useEffect, useState} from "react";
import Frame from 'components/ui/Frame';
import 'styles/views/OngoingGame.scss';
import {api, handleError} from "../../helpers/api";
import { Spinner } from 'components/ui/Spinner';
import Square from "components/ui/Square";
import 'styles/ui/Board.scss'
import SquareModel from "models/SquareModel";
import Piece from "components/ui/Piece";
import StrategoSocket from "components/socket/StrategoSocket";


let draggingStartCord = null;
let droppingTarget = null;
let pieceBeingDragged = null;

const Board = ({targetBoard}) => {

  const [boardToConvert, setBoardToConvert] = useState(targetBoard);

  let sourceSquare = null;

  const handlePieceDragStart = (e) => {
    // console.log("dragging");
    pieceBeingDragged = e.target;
    // console.log(pieceBeingDragged);
    sourceSquare = e.target.closest(".square");
    // console.log(sourceSquare);
    // assigning the dragging piece coordiante
    draggingStartCord = [e.target.parentNode.getAttribute("x"), e.target.parentNode.getAttribute("y")];
    // console.log(draggingStartCord);
    // console.log("drag start from: " + draggingStartCord);
  }

  // useEffect(() => {
  //   // console.log("running use effect");
  //   async function fetchData() {
  //     try {
  //       const response = await api.get('/boards');
  //       setBoard(response.data);
  //     } catch(error) {
  //       alert("Something went wrong while fetching the game! See the console for details.")
  //     }
  //   }
  //   fetchData();
  // }, [boardToConvert]);


  const handleSquareDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.target.setAttribute("data-draggable", true);
  }

  const handleSquareDrop = (e) => {
    e.preventDefault();

    // check if dropping on an empty square -- player try to move a piece
    if(e.target.getAttribute("class").includes("square")){
      // append the piece into the target square
      console.log(pieceBeingDragged);
      e.target.append(pieceBeingDragged);
      pieceBeingDragged = null;
      // assign the dropping target coordinate
      droppingTarget = [e.target.getAttribute("x"), e.target.getAttribute("y")];
      sendMovingPiece(draggingStartCord, droppingTarget);
    } else if(e.target.getAttribute("class").includes("piece")){ // player try to attack
      const targetSquare = e.target.closest(".square");
      droppingTarget = [targetSquare.getAttribute("x"), targetSquare.getAttribute("y")]
      // prevent from attacking self
      if((droppingTarget[0]!== draggingStartCord[0])||(droppingTarget[1]!== draggingStartCord[1])){
        sourceSquare.removeChild(pieceBeingDragged);
        sendMovingPiece(draggingStartCord, droppingTarget);
      }
    }
    // clear the variables
    draggingStartCord = null;
    droppingTarget = null;
    console.log("the dragging square after dropping is :"+draggingStartCord);
  }

  async function sendMovingPiece(source, target) {
      console.log(`value: ${source} type: ${typeof(source)}`);
      try {
        const requestBody = JSON.stringify({source, target});
        console.log(requestBody);
        const response = await api.put("/boards", requestBody);
        // ws.send(JSON.stringify({
        //   method: 'PUT',
        //   body: requestBody
        // }));
        // ws.onmessage = function(event) {
        //   console.log('Received message from server: ' + event.data);
        // };
        console.log("send put request");
        console.log(response);
        console.log("request body is: " + requestBody);
        // console.log(response.requestBody.requestURL);
        // console.log(typeof(source));
      } catch(error) {
        console.error(`Something went wrong while fetching the opponent: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while moving the piece See the console for details.")
      }
  }

  const onMessage = (msg) => {
    console.log(msg);
    // setBoard(msg);
    setBoardToConvert(msg);
  }



  let gameBoard = [];

  for(let i=0; i<10; i++) {
      for(let j=0; j<10; j++) {
          const pieceId = j + i * 10;
          const targetPiece = boardToConvert[pieceId];
          const pieceType = targetPiece.piece.pieceType.toLowerCase();
          const army = targetPiece.piece.armyType.toLowerCase();
          let piece = null;

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
                // squareid={[i, j]}
                x = {`_${i}`}
                y = {`_${j}`}
              />
            );
          } else {
            gameBoard.push(
              <Square 
                key={pieceId}
                value={i + j + 2}
                content={piece}
                type={"LAKE"}
                // squareid={[i, j]}
                x = {`_${i}`}
                y = {`_${j}`}
              />
            );
          }
        }
  }

  return (
  <div className='board'>
    {gameBoard}
    <StrategoSocket
        topics="/ongoingGame"
        onMessage={onMessage}
    />
  </div>
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

  return (
    <Frame>
      {/* <WebSocket/> */}
      <div className='ongoingGame container'>
        {content}
      </div>
    </Frame>
  );
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


export default OngoingGame;