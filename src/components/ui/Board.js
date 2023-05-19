import React from "react";
import "styles/views/OngoingGame.scss";
import { api } from "../../helpers/api";
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
  let selectedSquare = null;

  const handlePieceClick = async (e) => {
    selectedSquare = e.target.closest(".square");
    console.log(selectedSquare);
    const piecesToHighlight = await fetchAvailableOperation(selectedSquare);
    console.log(piecesToHighlight);
    highlightAvailableOperation(piecesToHighlight);
  };

  // fetch available moving path of a selected piece for highlighting
  async function fetchAvailableOperation(source) {
    const x = source.getAttribute("x");
    const y = source.getAttribute("y");
    try {
      const response = await api.get(
        `/rooms/${roomId}/availableMovements?x=${x}&y=${y}`
      );
      return response.data;
    } catch (error) {
      alert(error.data.message);
    }
  }

  function highlightAvailableOperation(pieces) {
    const allSquares = Array.prototype.slice.call(
      document.getElementsByClassName("square")
    );
    allSquares.forEach((element) => {
      pieces.forEach((piece) => {
        if (
          element.getAttribute("x") === piece.axisX &&
          element.getAttribute("y") === piece.axisY
        ) {
          if (piece.content === null) {
            element.classList.add("highlight");
            element.classList.add("movement");
          } else {
            element.classList.add("highlight");
            element.classList.add("attack");
          }
          setTimeout(() => {
            console.log("highlighting movement");
            element.classList.remove("highlight");
          }, 1500);
          console.log(element.classList);
        }
      });
    });
  }

  const handlePieceDragStart = (e) => {
    sourceSquare = e.target.closest(".square");
    draggingStartCord = [
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
      if (
        // only alert when it is dropped on another piece, ignore the case when dropping on itself
        draggingStartCord[0] !== droppingTarget[0] ||
        draggingStartCord[1] !== droppingTarget[1]
      ) {
        alert("You can't attack your own piece! Try again");
      }
    } else {
      sendMovingPiece(draggingStartCord, droppingTarget);
      draggingStartCord = null;
      droppingTarget = null;
    }
  };

  async function sendMovingPiece(source, target) {
    try {
      const requestBody = JSON.stringify({ source, target });
      const response = await api.put(
        `/rooms/${roomId}/players/${playerId}/moving`,
        requestBody
      );
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  // show board component based on the board received
  function showBoard(boardToConvert) {
    // console.log(boardToConvert);
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
        let isHighlighting = null;

        if (targetPiece.type === "BATTLE_FIELD") {
          if (army !== playerArmyType) {
            // opponent's piece, disable drag effect
            draggable = false;
            if (!isRevealed) {
              isHid = true;
            }
          } else {
            // player's own piece, disable onDrop, enable avaliable operation highlighting
            isBlocked = true;
            isHighlighting = handlePieceClick;
            if (pieceType === "bomb" || pieceType === "flag") {
              draggable = false;
            } else if (operatingPlayer !== playerId) {
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
                onClick={isHighlighting}
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

  let boardContent = showBoard(targetBoard);

  return <div className="board">{boardContent}</div>;
};

export default Board;
