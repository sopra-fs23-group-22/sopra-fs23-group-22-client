import RoomList from "./RoomList";
import PlayerList from "./PlayerList";
import "styles/ui/RoomContainer.scss";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import StrategoSocket from "../socket/StrategoSocket";
const RoomContainer = ({ roomId }) => {
  const history = useHistory();
  
  const roomRules = [
    "The first player to enter the room will command the Red Army and the other one will command the Blue Army.",
    'Click on the "Enter Game" button when your opponent enters the room, both of your will go to preparing page, where you can set up the initial board for your army.',
  ];
  const roomInformation = "Are you ready to start a game? ";
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
    //console.log(msg.length);
    // if the game state is changed to "preplay", then they should both enter the game
    if (msg === "PRE_PLAY") {
      enterGame();
    }
  };
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
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
        <PlayerList roomId={roomId}/>
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
