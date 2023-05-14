import React, { useEffect } from "react";
import "../../styles/views/GameResult.scss";
import { useState } from "react";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../ui/Spinner";
import user from "../../models/User";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import CustomPopUp from "components/ui/CustomPopUp";
import StrategoSocket from "../socket/StrategoSocket";

const GameResultPopUp = () => {
  const roomId = localStorage.getItem("roomId");
  const history = useHistory();
  const [playerIds, setPlayerIds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const token = localStorage.getItem("token");
  const playerId = parseInt(localStorage.getItem("playerId"));
  const [showOpenGameResultPopup, setGameResultPopUp] = useState(false);

  const playAgain = () => {
    // ... more operations
    history.push(`/rooms/${roomId}`);
  };

  const goLobby = async () => {
    try {
      const userId = localStorage.getItem("id");
      const removeUser = { id: userId.toString() };
      const requestBody = JSON.stringify(removeUser);
      await api.put(`/rooms/${roomId}/remove`, requestBody);
      // const response = await api.put("/rooms/remove/" + roomId, requestBody);
      localStorage.removeItem("roomId");
      history.push("/lobby");
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while return to lobby! See the console for details."
      );
    }
  };

  let listContent = <Spinner />;

  let onMessage = async (msg) => {
    if (msg.winnerId !== -1) {
      if (JSON.stringify(msg.winnerId) === localStorage.getItem("id")) {
        setGameResult("VICTORY");
        setGameResultPopUp(true);
      } else {
        setGameResult("DEFEAT");
        setGameResultPopUp(true);
      }
      //show the name of the winner
      try {
        const winner = await api.get("/users/" + msg.winnerId);
        setWinner(winner.data.username);
      } catch (error) {
        console.error("Error retrieving winner:", error);
      }
    }
  };

  return (
    <CustomPopUp open={showOpenGameResultPopup} information="">
      <label
        className={gameResult === "VICTORY" ? "winnerWindow" : "loserWindow"}
      >
        {gameResult}
      </label>
      {winner ? <label>{winner} won the game</label> : null}
      <Button
        className="lobby base-container-button"
        onClick={() => playAgain()}
      >
        PLAY AGAIN
      </Button>
      <Button className="lobby base-container-button" onClick={() => goLobby()}>
        LOBBY
      </Button>
      <StrategoSocket topics={`/ongoingGame/${roomId}`} onMessage={onMessage} />
    </CustomPopUp>
  );
};

export default GameResultPopUp;
