import React, { useState, useEffect } from "react";
import "styles/views/OngoingGame.scss";
import { api, handleError } from "../../helpers/api";
import Square from "components/ui/Square";
import "styles/ui/Board.scss";
import Piece from "components/ui/Piece";

const Board = ({
  targetBoard,
  roomId,
  playerId,
  playerArmyType,
  operatingPlayer,
}) => {
  let draggingStartCord = null;
  let droppingTarget = null;
  let sourceSquare = null;
  // let selectedSquareCord = null;

  // console.log(`current player is: ${operatingPlayer}`);

  let selectedSquare = null;
  const handlePieceClick = (e) => {
    console.log(e.target);
    selectedSquare = e.target.closest(".square");
    console.log(e.target.closest(".piece"));
    console.log(selectedSquare);
    fetchAvailableMovements(selectedSquare);
  };

  async function fetchAvailableMovements(source) {
    console.log(source);
    const x = source.getAttribute("x");
    const y = source.getAttribute("y");
    const availableMovements = await api.get(
      `/rooms/${roomId}/availableMovements?x=${x}&y=${y}`
    );
    console.log(availableMovements.request);
    console.log(availableMovements.data);
  }

  const handlePieceDragStart = (e) => {
    // pieceBeingDragged = e.target;
    sourceSquare = e.target.closest(".square");
    draggingStartCord = [
      // e.target.parentNode.getAttribute("x"),
      // e.target.parentNode.getAttribute("y"),
      sourceSquare.getAttribute("x"),
      sourceSquare.getAttribute("y"),
    ];
    console.log(draggingStartCord);
  };

  const handleSquareDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.target.setAttribute("data-draggable", true);
  };

  const handleSquareDrop = (isBlocked) => (e) => {
    e.preventDefault();
    if (e.target.getAttribute("class").includes("square")) {
      droppingTarget = [e.target.getAttribute("x"), e.target.getAttribute("y")];
    } else if (e.target.getAttribute("class").includes("piece")) {
      const targetSquare = e.target.closest(".square");
      droppingTarget = [
        targetSquare.getAttribute("x"),
        targetSquare.getAttribute("y"),
      ];
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
      // pieceBeingDragged = null;
      // clear the variables
      draggingStartCord = null;
      droppingTarget = null;
    }
  };

  async function sendMovingPiece(source, target) {
    // console.log(`value: ${source} type: ${typeof source}`);
    try {
      const requestBody = JSON.stringify({ source, target });
      // console.log(requestBody);
      const response = await api.put(
        `/rooms/${roomId}/players/${playerId}/moving`,
        requestBody
      );
      // console.log("send put request");
      // console.log(response);
    } catch (error) {
      alert(error.response.data.message);
      // console.error(
      //   `Something went wrong while moving a piece: \n${handleError(error)}`
      // );
      // console.error("Details:", error);
      // alert(
      //   "Something went wrong while moving the piece See the console for details."
      // );
    }
  }

  // show board component based on the board received
  function showBoard(boardToConvert) {
    console.log(boardToConvert);
    let boardToRender = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const pieceId = j + i * 10;
        const targetPiece = boardToConvert[pieceId];
        const pieceType = targetPiece.piece.pieceType.toLowerCase();
        const army = targetPiece.piece.armyType.toLowerCase();
        const isRevealed = targetPiece.piece.revealed;
        let piece = null;
        let draggable = true;
        let isBlocked = false;
        let isHid = false;
        // console.log(`revealed status: ${isRevealed}`);
        // console.log(typeof isRevealed);

        if (targetPiece.type === "BATTLE_FIELD") {
          if (army !== playerArmyType) {
            // opponent's piece, disable drag effect
            draggable = false;
            if (!isRevealed) {
              isHid = true;
            }
          } else {
            // player's own piece, disable onDrop
            isBlocked = true;
            if (pieceType === "bomb" || pieceType === "flag") {
              draggable = false;
            } else if (operatingPlayer !== playerId) {
              // console.log(
              //   `operating player is: ${operatingPlayer}, current player is ${playerId}`
              // );
              //console.log(operatingPlayer === playerId);
              draggable = false;
            }
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
                onClick={handlePieceClick}
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

  return <div className="board">{showBoard(targetBoard)}</div>;
};

export default Board;
