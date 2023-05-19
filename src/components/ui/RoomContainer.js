import RoomList from "./RoomList";
import PlayerList from "./PlayerList";
import "styles/ui/RoomContainer.scss";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import StrategoSocket from "../socket/StrategoSocket";
const RoomContainer = ({ roomId }) => {
  const history = useHistory();
  const [notAbleToStart, setnotAbleToStart] = useState(true);

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
      enterGame();
    }
  };
  useEffect(() => {
    let armyType = null;
    async function fetchPlayers() {
      try {
        const players = await api.get("/rooms/" + roomId + "/players");
        const playerNumber = players.data.length;
        if (playerNumber === 2) {
          setnotAbleToStart(false);
          console.log("setting button");
        }
        // const currentPlayer = localStorage.getItem("id");
        // if (currentPlayer === JSON.stringify(players[0])) {
        //   armyType = "red";
        // } else if (currentPlayer === JSON.stringify(players[1])) {
        //   armyType = "blue";
        // }
        // localStorage.setItem("armyType", armyType);
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
        <PlayerList roomId={roomId} />
      </div>
      <div className="roomContainer-buttonArea">
        <button
          className="roomContainer-button"
          disabled={notAbleToStart}
          onClick={() => enterGame()}
        >
          Enter Game
        </button>
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
