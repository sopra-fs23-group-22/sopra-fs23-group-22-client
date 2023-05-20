import React, { useEffect, useState } from "react";
import Square from "./Square";
import Piece from "./Piece";
import { useHistory, useParams } from "react-router-dom";
import { Spinner } from "./Spinner";
import { api, handleError } from "../../helpers/api";
import ConfigurationModel from "../../models/ConfigurationModel";
import CustomPopUp from "./CustomPopUp";
import StrategoSocket from "../socket/StrategoSocket";
import "styles/ui/GamePreparingContainer.scss";
import JokeGenerator from "./JokeGenerator";
const GamePreparingContainer = () => {
  const DefaultBoard = (props) => {
    const { army, pattern } = props;
    console.log(`army type: ${army}`);
    const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);
    let positionToBeSwapped = null;

    const handlePieceClick = (row, col) => (e) => {
      console.log(e.target);
      console.log(e.target.closest(".square"));
      // if the first position is not selected yet
      if (selectedPiecePosition === null) {
        // assign the position to the variable
        setSelectedPiecePosition([row, col]);
        // add highlight to selected pieces
        const element = e.target.closest(".square");
        element.classList.add("highlight-selected");
      } else {
        // remove highlighting effect
        const elementToRemoveHighlight =
          document.getElementsByClassName("highlight-selected")[0];
        elementToRemoveHighlight.classList.remove("highlight-selected");
        // store the position of the other selected piece
        positionToBeSwapped = [row, col];
        pattern.swapPieces(selectedPiecePosition, positionToBeSwapped);
        setSelectedPiecePosition(null);
      }
    };

    const board = [];
    const pieces = pattern.configuration;
    console.log(pieces);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        const pieceType = pieces[i][j];
        if (pieceType === "LAKE") {
          board.push(
            <Square key={`${i}-${j}`} value={i + j + 2} type={"LAKE"} />
          );
        } else {
          const piece =
            pieceType !== null ? (
              <Piece
                type={pieceType}
                army={army}
                onClick={handlePieceClick(i, j)}
                // onClick={handlePieceClick}
              />
            ) : null;
          board.push(
            <Square key={`${i}-${j}`} value={i + j + 2} content={piece} />
          );
        }
      }
    }

    return <div className="defaultBoard">{board}</div>;
  };

  const { roomId, playerId } = useParams();
  const [rightContent, setRightContent] = useState(<Spinner />);
  const history = useHistory();
  let gameState = null;
  let configuration = null;
  let armyType = null;

  const onMessage = (msg) => {
    gameState = msg;
    console.log(msg);
    if (gameState === "IN_PROGRESS") {
      console.log("successful");
      history.push(`/rooms/${roomId}/game/players/${playerId}`);
    }
  };

  useEffect(() => {
    async function fetchPlayers() {
      console.log("use effect fetch players");
      try {
        const room = await api.get("/rooms/" + roomId);
        const players = room.data.userIds;
        const currentPlayer = localStorage.getItem("id");
        if (currentPlayer === JSON.stringify(players[0])) {
          armyType = "red";
        } else if (currentPlayer === JSON.stringify(players[1])) {
          armyType = "blue";
        }
        localStorage.setItem("armyType", armyType);
        configuration = new ConfigurationModel(armyType);
        setRightContent(
          <div className="gamePreparingContainer-boardAndButton">
            <div className="gamePreparingContainer-boardArea">
              <DefaultBoard army={armyType} pattern={configuration} />
            </div>
            <div className="gamePreparingContainer-buttonArea">
              <button
                className="gamePreparingContainer-button"
                onClick={doConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        );
      } catch (error) {
        console.error(
          `Something went wrong while fetching the players: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the players! See the console for details."
        );
      }
    }

    fetchPlayers();
  }, []);

  const doConfirm = async () => {
    try {
      const requestBody = JSON.stringify(configuration.getPieces());
      const response = await api.put(`/rooms/${roomId}/setBoard`, requestBody);
      console.log(response);
      if (response.data === "PRE_PLAY") {
        console.log("preparing");
        setRightContent(
          <div>
            {/* <CustomPopUp
              open={true}
              information="Please wait for your opponent to set the Board."
            >
              <Spinner />
            </CustomPopUp> */}
            <JokeGenerator />
          </div>
        );
      } else if (response.data === "IN_PROGRESS") {
        console.log("successful");
        history.push(`/rooms/${roomId}/game/players/${playerId}`);
      }
    } catch (error) {
      console.error(
        `Something went wrong while sending the board: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while sending the board! See the console for details."
      );
    }
  };
  return (
    <div className="gamePreparingContainer-container">
      {rightContent}
      <StrategoSocket topics={"/loading/" + roomId} onMessage={onMessage} />
    </div>
  );
};
export default GamePreparingContainer;
