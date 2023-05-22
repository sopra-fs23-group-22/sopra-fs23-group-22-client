import RoomList from "./RoomList";
import PlayerList from "./PlayerList";
import "styles/ui/RoomContainer.scss";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import StrategoSocket from "../socket/StrategoSocket";
import { Button } from "./Button";
import CustomPopUp from "./CustomPopUp";
const RoomContainer = ({ roomId }) => {
  const history = useHistory();
  const [notAbleToStart, setnotAbleToStart] = useState(true);
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const onMessage = (msg) => {
    console.log(msg.length);
    if (msg.length === 2) {
      setnotAbleToStart(false);
    } else {
      setnotAbleToStart(true);
    }
  };

  const gameStateChange = (msg) => {
    if (msg === "PRE_PLAY") {
      setPopUpOpen(true);
      setTimeout(() => {
        enterGame();
      }, 1500);
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

  const enterGame = async () => {
    const response = await api.put(`rooms/${roomId}/game/start`);
    console.log(response);
    history.push(
      `/rooms/${localStorage.getItem(
        "roomId"
      )}/preparing/players/${localStorage.getItem("id")}`
    );
  };
  return (
    <div className="roomContainer">
      <div className="roomContainer-title">Waiting Room</div>
      <div className="roomContainer-content">
        <CustomPopUp open={isPopUpOpen}>
          Your opponent has started the game, please wait a sencond to enter.
        </CustomPopUp>
        <PlayerList roomId={roomId} />
      </div>
      <div className="roomContainer-buttonArea">
        <Button
          // className="roomContainer-button"
          disabled={notAbleToStart}
          onClick={() => {
            enterGame();
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
