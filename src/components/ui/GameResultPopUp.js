import React from "react";
// import "../../styles/views/GameResult.scss";
import { useState } from "react";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import CustomPopUp from "components/ui/CustomPopUp";
import StrategoSocket from "../socket/StrategoSocket";

const GameResultPopUp = () => {
  const roomId = localStorage.getItem("roomId");
  const history = useHistory();
  const [gameResult, setGameResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showOpenGameResultPopup, setGameResultPopUp] = useState(false);
  const [gameResultPopUpInfo, setGameResultPopUpInfo] = useState("");

  const playAgain = async () => {
    // ... more operations
    // localStorage.removeItem("roomState");
    try {
      await api.put(`/rooms/${roomId}/game/confirmResult`);
      history.push(`/rooms/${roomId}`);
    } catch (error) {
      console.log("updating player result confirmation failed")
    }
  };

  const goLobby = async () => {
    try {
      const userId = localStorage.getItem("id");
      const removeUser = { id: userId.toString() };
      const requestBody = JSON.stringify(removeUser);
      await api.put(`/rooms/${roomId}/remove`, requestBody);
      await api.put(`/rooms/${roomId}/game/confirmResult`);
      localStorage.removeItem("roomId");
      localStorage.removeItem("roomState");
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

  let onMessage = async (msg) => {
    if (msg.winnerId !== -1) {
      if (msg.playerIdResigned !== -1) {
        if (
          JSON.stringify(msg.playerIdResigned) === localStorage.getItem("id")
        ) {
          setGameResultPopUpInfo("You resigned!");
        } else {
          setGameResultPopUpInfo("Your opponent resigned! You won!");
        }
      }
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
    <CustomPopUp
      open={showOpenGameResultPopup}
      information={gameResultPopUpInfo}
    >
      <label
        className={gameResult === "VICTORY" ? "winnerWindow" : "loserWindow"}
      >
        {gameResult}
      </label>
      {winner ? <label>{winner} won the game</label> : null}
      <Button onClick={() => playAgain()} style={{ width: "180px" }}>
        PLAY AGAIN
      </Button>
      <Button onClick={() => goLobby()} style={{ width: "180px" }}>
        LOBBY
      </Button>
      <StrategoSocket topics={`/ongoingGame/${roomId}`} onMessage={onMessage} />
    </CustomPopUp>
  );
};

export default GameResultPopUp;
