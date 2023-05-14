import React, { useEffect, useState } from "react";
import Frame from "components/ui/Frame";
import "styles/views/OngoingGame.scss";
import {api, handleError} from "../../helpers/api";
import { Spinner } from "components/ui/Spinner";
import "styles/ui/Board.scss";
import SquareModel from "models/SquareModel";
import Board from "components/ui/Board";
import StrategoSocket from "components/socket/StrategoSocket";
import GameResultPopUp from "../ui/GameResultPopUp";
import { useParams } from "react-router-dom";
import LeftSideBar from "components/ui/LeftSideBar";

const OngoingGame = () => {
  const [board, setBoard] = useState([]);
  const { roomId, playerId } = useParams();
  const playerArmyType = localStorage.getItem("armyType");
  const [operatingPlayer, setOperatingPlayer] = useState(null);
  const [operatingPlayerName, setOperatingPlayerName] = useState([null]);
  let content = <Spinner />;

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchPlayers() {
      try {
        const roomId = localStorage.getItem('roomId');
        const response = await api.get("/users/"+operatingPlayer);
        //console.log("Players: ", response.data);
        setOperatingPlayerName(response.data.username);

      } catch (error) {
        console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
        console.error("Details:", error);
        // alert("Something went wrong while fetching the players! See the console for details.");
      }
    }
    fetchPlayers();
  },[operatingPlayer]);

  useEffect(() => {
    async function fetchFirstPlayer() {
      try {
        console.log("use effect running");
        const firstPlayer = await api.get(`/rooms/${roomId}/turn`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOperatingPlayer(JSON.stringify(firstPlayer.data));
        console.log(firstPlayer.data);
        console.log(operatingPlayer);
      } catch (error) {
        alert(
          "Something went wrong while fetching the first player! See the console for details."
        );
      }
    }
    fetchFirstPlayer();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          `/rooms/${localStorage.getItem("roomId")}/game`
        );
        console.log(response.data);
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
    //console.log(msg.board);
    setBoard(msg.board);
    setOperatingPlayer(JSON.stringify(msg.currentPlayerId));
  };

  if (board.length !== 0 && board !== undefined) {
    console.log(operatingPlayer);
    content = (
      <div>
        {/*<h1 style={{ color: "white" }}>Current Player is: {operatingPlayer}</h1>*/}
        <h1 style={{ color: "white" }}>Current Player is: {operatingPlayerName}</h1>
        <Board
          targetBoard={convertToSquareModelList(board)}
          roomId={localStorage.getItem("roomId")}
          playerId={playerId}
          playerArmyType={playerArmyType}
          operatingPlayer={operatingPlayer}
        />
      </div>
    );
  }

  let gameResultPopUp = <GameResultPopUp />;

  return (
    <Frame>
      <StrategoSocket topics={`/ongoingGame/${roomId}`} onMessage={onMessage} />
      <LeftSideBar isRenderSearchBox={false} upperList="players" />
      <div className="ongoingGame container">{content}</div>
      <div className="gameResultPopUp container">{gameResultPopUp}</div>
    </Frame>
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
