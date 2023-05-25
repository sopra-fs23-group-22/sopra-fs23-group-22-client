import React, {useEffect, useState} from "react";
import "styles/views/OngoingGame.scss";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "components/ui/elements/Spinner";
import "styles/ui/Board.scss";
import SquareModel from "models/SquareModel";
import Board from "components/ui/board/Board";
import StrategoSocket from "components/socket/StrategoSocket";
import GameResultPopUp from "../ui/popUps/GameResultPopUp";
import {useParams} from "react-router-dom";
import LeftSideBar from "components/ui/elements/LeftSideBar";
import {Button} from "../ui/elements/Button";
import ResignConfirmationPopUp from "../ui/popUps/ResignConfirmationPopUp";
import NavBar from "../ui/elements/NavBar";
import "../../styles/views/Whole.scss";
import RulePopUp from "components/ui/popUps/RulePopUp";

const OngoingGame = () => {
  localStorage.setItem("roomState", "GAME_ON");

  const [board, setBoard] = useState([]);
  const {roomId, playerId} = useParams();
  const playerArmyType = localStorage.getItem("armyType");
  const [operatingPlayer, setOperatingPlayer] = useState(null);
  const [operatingPlayerName, setOperatingPlayerName] = useState([null]);
  const [showResignConfirmationPopUp, setShowResignConfirmationPopUp] =
    useState(false);

  let content = <Spinner/>;

  useEffect(() => {
    async function fetchFirstPlayer() {
      try {
        const firstPlayer = await api.get(`/rooms/${roomId}/turn`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOperatingPlayer(JSON.stringify(firstPlayer.data));
      } catch (error) {
        alert(
          "Something went wrong while fetching the first player! See the console for details."
        );
      }
    }

    fetchFirstPlayer();
  }, []);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    if (operatingPlayer) {
      fetchPlayerName();
    }
  }, [operatingPlayer]);

  async function fetchPlayerName() {
    try {
      const response = await api.get("/users/" + operatingPlayer);
      setOperatingPlayerName(response.data.username);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the players: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          `/rooms/${localStorage.getItem("roomId")}/game`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBoard(response.data);
      } catch (error) {
        alert(
          "Something went wrong while fetching the game! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  const onMessage = (msg) => {
    setBoard(msg.board);
    setOperatingPlayer(JSON.stringify(msg.currentPlayerId));
  };

  if (board.length !== 0 && board !== undefined) {
    content = (
      <div className="ongoingGameContainer">
        <h1 className="titleContainer">
          CURRENT PLAYER: {operatingPlayerName}
        </h1>
        <div className="boardContainer">
          <Board
            targetBoard={convertToSquareModelList(board)}
            roomId={localStorage.getItem("roomId")}
            playerId={playerId}
            playerArmyType={playerArmyType}
            operatingPlayer={operatingPlayer}
          />
        </div>
        <div className="ongoingGame-buttonArea">
          <Button
            className="ongoingGame-button"
            onClick={() => setShowResignConfirmationPopUp(true)}
          >
            Resign
          </Button>
        </div>
      </div>
    );
  }

  let gameResultPopUp = <GameResultPopUp/>;

  return (
    <div className="whole">
      <div className="leftSideBar">
        <LeftSideBar isRenderSearchBox={false} upperList="players"/>
      </div>
      <div className="right">
        <NavBar/>
        <div className="main">
          <div className="info-container">
            <RulePopUp/>
          </div>
          <div className="ongoingGame">
            <StrategoSocket
              topics={`/ongoingGame/${roomId}`}
              onMessage={onMessage}
            />
            {content}
            <div className="gameResultPopUp container">{gameResultPopUp}</div>
            <div className="gameResultPopUp container">
              <ResignConfirmationPopUp
                show={showResignConfirmationPopUp}
                onClose={() => setShowResignConfirmationPopUp(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function convertToSquareModelList(targetBoard) {
  const squareList = [];
  for (const element of targetBoard) {
    let square = new SquareModel(
      element.axisX,
      element.axisY,
      element.type,
      element.content
    );
    squareList.push(square);
  }
  return squareList;
}

export default OngoingGame;
