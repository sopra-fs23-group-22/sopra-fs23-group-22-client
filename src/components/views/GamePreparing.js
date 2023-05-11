import React, { useEffect } from "react";
import "../../styles/views/GamePreparing.scss";
import Square from "components/ui/Square";
import Piece from "components/ui/Piece";
import { useState } from "react";
import GamePiece from "models/GamePiece";
import PropTypes from "prop-types";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../ui/Spinner";
import { useHistory, useParams } from "react-router-dom";
import { Popup } from "components/ui/PopUp";
import StrategoSocket from "components/socket/StrategoSocket";
import PlayerList from "../ui/PlayerList";
import RulePopUp from "components/ui/RulePopUp";
import CustomPopUp from "components/ui/CustomPopUp";
import ConfigurationModel from "models/ConfigurationModel";

const DefaultBoard = (props) => {
  const { army, pattern } = props;
  console.log(`army type: ${army}`);
  const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);
  let positionToBeSwapped = null;

  const handlePieceClick = (row, col) => {
    // if the first position is not selected yet
    if (selectedPiecePosition === null) {
      // assign the position to the variable
      setSelectedPiecePosition([row, col]);
    } else {
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
              onClick={() => handlePieceClick(i, j)}
            />
          ) : null;
        board.push(
          <Square key={`${i}-${j}`} value={i + j + 2} content={piece} />
        );
      }
    }
  }

  return <div className="pregame defaultBoard">{board}</div>;
};

const GamePreparing = () => {
  const { roomId, playerId } = useParams();
  const [rightContent, setRightContent] = useState(<Spinner />);
  const history = useHistory();
  let gameState = null;
  let configuration = null;
  let armyType = null;

  const onMessage = (msg) => {
    gameState = msg;
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
          <div className="pregame container">
            <div className="pregame board-container">
              <DefaultBoard army={armyType} pattern={configuration} />
            </div>
            <div className="pregame confirm-button-container">
              <button className="pregame confirm-button" onClick={doConfirm}>
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
            <CustomPopUp
              open={true}
              information="Please wait for your opponent to set the Board."
            >
              <Spinner />
            </CustomPopUp>
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
    <div className="lobby row">
      <div className="lobby left">
        <StrategoSocket topics={"/loading/" + roomId} onMessage={onMessage} />
        <div className="lobby left-search-user">
          <div className="lobby left-search-input" />
        </div>

        <div className="lobby left-down-side">
          <div className="lobby online-users-container">
            <div className="lobby online-users-title">Players</div>
            <div className="lobby online-users-list">
              <PlayerList />
            </div>
          </div>
          <div className="lobby online-users-container">
            <div className="lobby online-users-title">Chat</div>
            <div className="lobby online-users-list">Chat function</div>
          </div>
        </div>
      </div>
      <div className="lobby right">
        <div className="lobby right-header"></div>
        <div className="lobby right-main">
          <div className="lobby right-info-container">
            <RulePopUp />
          </div>
          <div className="lobby right-base-container">{rightContent}</div>
        </div>
      </div>
    </div>
  );
};

export default GamePreparing;
