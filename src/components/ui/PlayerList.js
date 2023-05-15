import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StrategoSocket from "../socket/StrategoSocket";
import { Spinner } from "./Spinner";
import PropTypes from "prop-types";
import flag from "../images/piece/stratego-flag.png";
import { height } from "@mui/system";
import "styles/ui/PlayerListContainer.scss";
const PlayerList = (props) => {
  const [players, setPlayers] = useState(null);
  const u = (msg) => {
    setPlayers(msg);
    console.log(players);
  };
  const OnlineUsers = ({ user }) => (
    // <div>
    //   <img src={flag} style={{ height: "40px" }} />
    //   <span className="lobby user-myself-username">{user.username}</span>
    // </div>
      <div className="item">
        <div className="item-icon">
        <img src={flag} className="icon"/>
        </div>
        <div className="item-username">{user.username}</div>
      </div>
    //  <div className="item">{user.username}</div>
  );

  OnlineUsers.propTypes = {
    user: PropTypes.object,
  };
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchPlayers() {
      try {
        const roomId = localStorage.getItem("roomId");
        const response = await api.get("/rooms/" + roomId + "/players");
        //console.log("Players: ", response.data);
        setPlayers(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the players: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        // alert("Something went wrong while fetching the players! See the console for details.");
      }
    }
    fetchPlayers();
  }, []);

  let playersContent = <Spinner />;
  if (Array.isArray(players)) {
    playersContent = (
      // <OnlineUsers user={players} key={players.id}/>
      <li>
        {players.map((user) => (
          <OnlineUsers user={user} key={user.id} />
        ))}
      </li>
    );
  }
  return (
    <div>
      {playersContent}
      <StrategoSocket topics="/room" onMessage={u} />
    </div>
  );
};
export default PlayerList;
