// import Board from 'components/ui/Board';
import React, { useState } from "react";
import "styles/views/OngoingGame.scss";
import { api, handleError } from "../../helpers/api";
import Square from "components/ui/Square";
import "styles/ui/Board.scss";
import Piece from "components/ui/Piece";
import StrategoSocket from "components/socket/StrategoSocket";
import SquareModel from "models/SquareModel";

const Board = ({ targetBoard, roomId, playerId, playerArmyType }) => {
  let draggingStartCord = null;
  let droppingTarget = null;
  let pieceBeingDragged = null;
  let sourceSquare = null;

  const handlePieceDragStart = (e) => {
    pieceBeingDragged = e.target;
    sourceSquare = e.target.closest(".square");
    draggingStartCord = [
      e.target.parentNode.getAttribute("x"),
      e.target.parentNode.getAttribute("y"),
    ];
  };

  const onMessage = (msg) => {
    console.log(msg);
    // console.log(msg.board);
    console.log("updating board");
    targetBoard = msg.board;
    setGameBoard(convertBoardDTOtoBoard(convertToSquares(msg.board)));
    console.log(
      `changes hannpen in room ${roomId} with player ${playerId} operating`
    );
  };

  const handleSquareDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.target.setAttribute("data-draggable", true);
  };

  const handleSquareDrop = (isBlocked) => (e) => {
    console.log(e.target);
    // prevent player from attacking his own pieces
    if (isBlocked) {
      alert("You can't attack your own piece! Try again");
    } else {
      e.preventDefault();
      if (e.target.getAttribute("class").includes("square")) {
        // console.log("it's a moving operation");
        droppingTarget = [
          e.target.getAttribute("x"),
          e.target.getAttribute("y"),
        ];
      } else if (e.target.getAttribute("class").includes("piece")) {
        // console.log("it's an attacking operation");
        const targetSquare = e.target.closest(".square");
        droppingTarget = [
          targetSquare.getAttribute("x"),
          targetSquare.getAttribute("y"),
        ];
      }
      // console.log(`dragging from ${draggingStartCord} to ${droppingTarget}`);
      sendMovingPiece(draggingStartCord, droppingTarget);
      pieceBeingDragged = null;
      // clear the variables
      draggingStartCord = null;
      droppingTarget = null;
      // console.log(
      //   "the dragging square after dropping is :" + draggingStartCord
      // );
    }
  };

  async function sendMovingPiece(source, target) {
    console.log(`value: ${source} type: ${typeof source}`);
    try {
      const requestBody = JSON.stringify({ source, target });
      // console.log(requestBody);
      const response = await api.put(
        `/rooms/${roomId}/players/${playerId}/moving`,
        requestBody
      );
      // console.log("send put request");
      // console.log(response);
      // console.log("request body is: " + requestBody);
    } catch (error) {
      console.error(
        `Something went wrong while moving a piece: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while moving the piece See the console for details."
      );
    }
  }
  const [gameBoard, setGameBoard] = useState(
    convertBoardDTOtoBoard(targetBoard)
  );

  // show board component based on the board received
  function convertBoardDTOtoBoard(targetBoard) {
    let boardToRender = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const pieceId = j + i * 10;
        const targetPiece = targetBoard[pieceId];
        const pieceType = targetPiece.piece.pieceType.toLowerCase();
        const army = targetPiece.piece.armyType.toLowerCase();
        let piece = null;
        let draggable = true;
        let isBlocked = false;
        let isHid = false;
        // let dropPiece = (e) => {
        //   console.log("here cannot drop");
        //   console.log(e);
        // };
        // const dropPiece = (e) => handleSquareDrop;

        if (targetPiece.type === "BATTLE_FIELD") {
          if (army === playerArmyType) {
            // player's own pieces, disable onDrop
            isBlocked = true;
            // bomb and flag are not allowed to move
            if (pieceType === "bomb" || pieceType === "flag") {
              draggable = false;
            }
          } else {
            // opponent's piece, disable drag effect
            isHid = true;
            draggable = false;
          }
          piece =
            pieceType !== null ? (
              <Piece
                id={`piece-${pieceId}`}
                class="piece"
                type={pieceType}
                army={army}
                draggable={draggable}
                onDragStart={handlePieceDragStart}
                hideImage={isHid}
              />
            ) : null;
          boardToRender.push(
            <Square
              class="square"
              key={pieceId}
              value={i + j + 2}
              content={piece}
              onDragOver={handleSquareDragOver}
              onDrop={handleSquareDrop(isBlocked)}
              x={`_${i}`}
              y={`_${j}`}
            />
          );
        } else {
          boardToRender.push(
            <Square
              key={pieceId}
              value={i + j + 2}
              content={piece}
              type={"LAKE"}
              x={`_${i}`}
              y={`_${j}`}
            />
          );
        }
      }
    }
    return boardToRender;
  }

  return (
    <div className="board">
      {gameBoard}
      <StrategoSocket topics={`/ongoingGame/${roomId}`} onMessage={onMessage} />
    </div>
  );
};

function convertToSquares(targetBoard) {
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

export default Board;
