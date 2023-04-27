import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import StrategoSocket from "../socket/StrategoSocket";
import {Spinner} from "./Spinner";
import PropTypes from "prop-types";

const PlayerList = props => {
    const [players, setPlayers] = useState(null);
    const u = (msg) => {
        setPlayers(msg.data);
        console.log(players);
    }
    const OnlineUsers = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
        </div>
    );

    OnlineUsers.propTypes = {
        user: PropTypes.object
    };
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchPlayers() {
            try {
                const roomId = localStorage.getItem('roomId');
                const response = await api.get("/rooms/"+roomId+"/players");
                setPlayers(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
                console.error("Details:", error);
                // alert("Something went wrong while fetching the players! See the console for details.");
            }
        }
        fetchPlayers();
    },[]);

    let playersContent = <Spinner/>;
    if(Array.isArray(players)) {
        playersContent = (
            // <OnlineUsers user={players} key={players.id}/>
            <ul>
                {players.map(user => (
                    <OnlineUsers user={user} key={user.id}/>
                ))}
            </ul>
        )
    }
    return (
        <div>
            {playersContent}
            <StrategoSocket topics="room" onMessage={u}/>
        </div>

    )
}
export default PlayerList;