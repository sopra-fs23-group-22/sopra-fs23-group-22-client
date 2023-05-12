import React, { useState, useEffect } from "react";
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
  const [operatingPlayer, setOperatingPlayer] = useState(null);

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
    console.log("updating board");
    targetBoard = msg.board;
    setGameBoard(convertBoardDTOtoBoard(convertToSquares(msg.board)));
    setOperatingPlayer(JSON.stringify(msg.currentPlayerId));
  };

  useEffect(async () => {
    const response = await api.get(`/rooms/${roomId}/turn`);
    setOperatingPlayer(JSON.stringify(response.data));
  }, []);

  const handleSquareDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.target.setAttribute("data-draggable", true);
  };

  const handleSquareDrop = (isBlocked) => (e) => {
    console.log(e.target);
    e.preventDefault();
    if (e.target.getAttribute("class").includes("square")) {
      droppingTarget = [e.target.getAttribute("x"), e.target.getAttribute("y")];
    } else if (e.target.getAttribute("class").includes("piece")) {
      const targetSquare = e.target.closest(".square");
      droppingTarget = [
        targetSquare.getAttribute("x"),
        targetSquare.getAttribute("y"),
      ];
      console.log(`dropping at ${droppingTarget}`);
    }
    // prevent player from attacking his own pieces
    if (isBlocked) {
      // only alert when it is dropped on another piece, ignore the case when dropping on itself
      if (
        draggingStartCord[0] !== droppingTarget[0] ||
        draggingStartCord[1] !== droppingTarget[1]
      ) {
        alert("You can't attack your own piece! Try again");
      }
    } else {
      sendMovingPiece(draggingStartCord, droppingTarget);
      pieceBeingDragged = null;
      // clear the variables
      draggingStartCord = null;
      droppingTarget = null;
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
      console.log("send put request");
      console.log(response);
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

        if (targetPiece.type === "BATTLE_FIELD") {
          if (army !== playerArmyType) {
            // opponent's piece, disable drag effect
            isHid = true;
            draggable = false;
          } else {
            // player's own piece, disable onDrop
            isBlocked = true;
            console.log(`Before condition, the draggable is ${draggable}`);
            console.log(operatingPlayer === playerId);
            console.log(`operating player is ${operatingPlayer}`);
            console.log(playerId);
            // if (operatingPlayer !== playerId) {
            //   console.log("not player's turn");
            //   // draggable = false;
            // } else {
            if (
              pieceType === "bomb" ||
              pieceType === "flag"
              // operatingPlayer !== playerId
            ) {
              console.log("it is a bomb, flag");
              draggable = false;
            } else {
              draggable = "true";
            }
            // }
            console.log(`After, the draggable is ${draggable}`);
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
