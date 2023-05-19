import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StrategoSocket from "../socket/StrategoSocket";
import { Spinner } from "./Spinner";
import PropTypes from "prop-types";
import player2 from "../images/player2.png";
import "styles/ui/PlayerList.scss";
const PlayerList = ({ roomId }) => {
  const [players, setPlayers] = useState(null);
  // const playerArmyType = localStorage.getItem("armyType");
  const u = (msg) => {
    console.log(msg);
    setPlayers(msg);
    console.log(players);
  };
  const Player = ({ user }) => {
    let color = null;
    console.log(`current player is: ${user.id}`);
    console.log(players[0].id);
    if (user.id !== players[0].id) {
      color = "blue";
    } else {
      color = "red";
    }
    return (
      <div className="item">
        <div className="item-icon">
          <img src={player2} className={"icon " + color} />
        </div>
        <div className="item-username">{user.username}</div>
      </div>
    );
  };

  Player.propTypes = {
    user: PropTypes.object,
    armyType: PropTypes.string,
  };
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchPlayers() {
      try {
        const response = await api.get("/rooms/" + roomId + "/players");
        setPlayers(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the players: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
      }
    }
    fetchPlayers();
  }, []);

  let playersContent = <Spinner />;
  if (Array.isArray(players)) {
    playersContent = (
      <li>
        {players.map((user) => (
          <Player user={user} key={user.id} />
        ))}
      </li>
    );
  }
  return (
    <div className="players">
      {playersContent}
      <StrategoSocket topics={`/room/${roomId}`} onMessage={u} />
    </div>
  );
};
export default PlayerList;
