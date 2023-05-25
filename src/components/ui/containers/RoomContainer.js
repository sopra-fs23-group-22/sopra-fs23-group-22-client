import PlayerList from "../PlayerList";
import "styles/ui/RoomContainer.scss";
import {useEffect, useState} from "react";
import {api, handleError} from "../../../helpers/api";
import {useHistory} from "react-router-dom";
import StrategoSocket from "../../socket/StrategoSocket";
import {Button} from "../elements/Button";
import CustomPopUp from "../popUps/CustomPopUp";

const RoomContainer = ({roomId}) => {
  const history = useHistory();
  const [notAbleToStart, setnotAbleToStart] = useState(true);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [gameState, setGameState] = useState(null);

  const onMessage = (msg) => {
    if (msg.length === 2) {
      setnotAbleToStart(false);
    } else {
      setnotAbleToStart(true);
    }
  };

  const gameStateChange = (msg) => {
    setGameState(msg);
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
      if (gameStateResponse.data === "FINISHED") {
        alert(
          "Your opponent hasn't confirmed the result of last game, please wait for a second!"
        );
      } else if (gameStateResponse.data === "WAITING") {
        try {
          const response = await api.put(`rooms/${roomId}/game/start`);
        } catch (error) {
          console.error();
        }
      }
    } catch (error) {
    }
  };

  return (
    <div className="roomContainer">
      <div className="roomContainer-title">ROOM {roomId}</div>
      <div className="roomContainer-content">
        <CustomPopUp open={isPopUpOpen}>
          One of the players has started the game, please wait a sencond to
          enter.
        </CustomPopUp>
        <PlayerList roomId={roomId}/>
      </div>
      <div className="roomContainer-buttonArea">
        <Button
          disabled={notAbleToStart}
          onClick={() => {
            handleClickEnterGame();
          }}
          style={{width: "200px"}}
        >
          Enter Game
        </Button>
      </div>
      <StrategoSocket topics={`/room/${roomId}`} onMessage={onMessage}/>
      <StrategoSocket
        topics={`/room/${roomId}/state`}
        onMessage={gameStateChange}
      />
    </div>
  );
};
export default RoomContainer;
