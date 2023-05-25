import RoomList from "./RoomList";
import PlayerList from "./PlayerList";
import "styles/ui/RoomContainer.scss";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import { useHistory, useParams } from "react-router-dom";
import StrategoSocket from "../socket/StrategoSocket";
import { Button } from "./Button";
import CustomPopUp from "./CustomPopUp";
const RoomContainer = ({ roomId }) => {
  const history = useHistory();
  const [notAbleToStart, setnotAbleToStart] = useState(true);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [gameState, setGameState] = useState(null);

  const onMessage = (msg) => {
    console.log(msg.length);
    if (msg.length === 2) {
      setnotAbleToStart(false);
    } else {
      setnotAbleToStart(true);
    }
  };

  const gameStateChange = (msg) => {
    console.log(msg);
    setGameState(msg);
    console.log(gameState);
    if (msg === "PRE_PLAY") {
      setPopUpOpen(true);
      setTimeout(() => {
        enterGame();
      }, 3000);
    }
  };

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const players = await api.get("/rooms/" + roomId + "/players");
        const playerNumber = players.data.length;
        if (playerNumber === 2) {
          setnotAbleToStart(false);
          console.log("setting button");
        }
      } catch (error) {
        console.error(
          `Something went wrong while fetching the players: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching players! See the console for details."
        );
      }
    }
    fetchPlayers();
  }, []);

  const enterGame = () => {
    history.push(
      `/rooms/${localStorage.getItem(
        "roomId"
      )}/preparing/players/${localStorage.getItem("id")}`
    );
  };

  const handleClickEnterGame = async () => {
    try {
      const gameStateResponse = await api.get(`rooms/${roomId}/gameState`);
      console.log(gameStateResponse.data);
      if (gameStateResponse.data === "FINISHED") {
        alert(
          "Your opponent hasn't confirmed the result of last game, please wait for a second!"
        );
      } else if (gameStateResponse.data === "WAITING") {
        try {
          const response = await api.put(`rooms/${roomId}/game/start`);
          console.log(response);
        } catch (error) {
          console.log("enter game fail");
          console.error();
        }
      }
    } catch (error) {
      console.log("fail enter");
    }
  };

  // /rooms/${roomId}/gameState
  //
  // try {
  //
  //   if(gameState==="FINISHED") {
  //     alert();
  //   }
  //   console.log(response);

  return (
    <div className="roomContainer">
      <div className="roomContainer-title">ROOM {roomId}</div>
      <div className="roomContainer-content">
        <CustomPopUp open={isPopUpOpen}>
          One of the players has started the game, please wait a sencond to
          enter.
        </CustomPopUp>
        <PlayerList roomId={roomId} />
      </div>
      <div className="roomContainer-buttonArea">
        <Button
          // className="roomContainer-button"
          disabled={notAbleToStart}
          onClick={() => {
            handleClickEnterGame();
          }}
          style={{ width: "200px" }}
        >
          Enter Game
        </Button>
      </div>
      <StrategoSocket topics={`/room/${roomId}`} onMessage={onMessage} />
      <StrategoSocket
        topics={`/room/${roomId}/state`}
        onMessage={gameStateChange}
      />
    </div>
  );
};
export default RoomContainer;
