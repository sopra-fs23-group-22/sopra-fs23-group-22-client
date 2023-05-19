import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StrategoSocket from "../socket/StrategoSocket";
import { Spinner } from "./Spinner";
import PropTypes from "prop-types";
import player2 from "../images/player2.png";
import "styles/ui/PlayerList.scss";
const PlayerList = ({ roomId }) => {
  const [players, setPlayers] = useState(null);
  const u = (msg) => {
    console.log(msg);
    setPlayers(msg);
    console.log(players);
  };
  const OnlineUsers = ({ user }) => (
    <div className="item">
      <div className="item-icon">
        <img src={player2} className="icon" />
      </div>
      <div className="item-username">{user.username}</div>
    </div>
  );

  OnlineUsers.propTypes = {
    user: PropTypes.object,
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
          <OnlineUsers user={user} key={user.id} />
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
