import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
// import PropTypes from "prop-types";
import OnlineUserList from "../ui/OnlineUserList";
import Myself from "../ui/Myself";
import PlayerList from "../ui/PlayerList";
import StrategoSocket from 'components/socket/StrategoSocket';


const Room = props => {

    // let notAbleToStart = true;

    const [notAbleToStart, setnotAbleToStart] = useState(true);

    const onMessage = (msg) => {
        console.log(msg.length);
        if(msg.length===2) {
            setnotAbleToStart(false);
            // notAbleToStart = false;
        } else {
            setnotAbleToStart(true);
        }
    }

    const {roomId} = useParams();

    const history = useHistory();
    const doLogout = async () => {
        try {
            const logout = {"status": "OFFLINE"};
            const requestBody = JSON.stringify(logout);
            const userId = localStorage.getItem('id');
            const response = await api.put("/users/" + userId, requestBody);

            /* add: remove user from the room if clicked "Logout" on room page*/
            const roomId = localStorage.getItem("roomId");
            const removeUser = {"id":userId.toString()};
            const requestBody2 = JSON.stringify(removeUser);
            const response2 = await api.put("/rooms/remove/" + roomId, requestBody2);

            localStorage.removeItem('roomId');
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            history.push('/login');
        } catch (error) {
            console.error(`Something went wrong while logout: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while logout! See the console for details.");
        }

    }
    const returnLobby = async () => {
        try {
            const userId = localStorage.getItem("id");
            const roomId = localStorage.getItem("roomId");
            const removeUser = {"id":userId.toString()};
            const requestBody = JSON.stringify(removeUser);
            const response = await api.put(`/rooms/${roomId}/remove`, requestBody);
            // const response = await api.put("/rooms/remove/" + roomId, requestBody);
            localStorage.removeItem('roomId');
            history.push('/lobby');
        } catch (error) {
            console.error(`Something went wrong while return to lobby: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while return to lobby! See the console for details.");
        }
    }

    // const notAbleToStart = async () => {
    //     const players = await api.get("/rooms/"+id+"/players");
    //     const playerNumber = players.data.length;
    //     console.log(playerNumber);
    //     if(playerNumber===2) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchPlayers() {
            try {
                const players = await api.get("/rooms/"+roomId+"/players");
                const playerNumber = players.data.length;
                if(playerNumber===2) {
                    setnotAbleToStart(false);
                    console.log("setting button");
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching players! See the console for details.");
            }
        }

        fetchPlayers();

    }, []);

    const enterGame = async () => {
        const response = await api.put(`rooms/${roomId}/game/start`);
        console.log(response);
        history.push(`/rooms/${localStorage.getItem("roomId")}/preparing/players/${localStorage.getItem("id")}`);
    }

    return (
        <div className="lobby row">
            <div className="lobby left">
                <div className="lobby left-search-user">
                </div>
                <div className="lobby left-down-side">
                    <div className="lobby online-users-container">
                        <div className="lobby online-users-title">
                            Online Users
                        </div>
                        <div className="lobby online-users-list">
                            <Myself/>
                            <OnlineUserList/>
                        </div>
                    </div>
                    <div className="lobby online-users-container">
                        <div className="lobby online-users-title">
                            Friends
                        </div>
                        <div className="lobby online-users-list">
                            Friend List
                        </div>
                    </div>
                </div>
            </div>
            <div className="lobby right">
                <div className="lobby right-header">
                    <div className="lobby right-home-button" onClick={() => returnLobby()}>
                        Lobby
                    </div>
                    <div className="lobby right-logout-button" onClick={() => doLogout()}>
                        Logout
                    </div>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                {/* Room{localStorage.getItem('roomId')} */}
                                Room{roomId}
                            </div>
                            <div className='lobby base-container-line'>
                            </div>
                            <div className="lobby base-container-room-list">
                                <div className="lobby online-users-list">
                                    <PlayerList/>
                                    {/*{playersContent}*/}
                                </div>
                            </div>
                            <div className="lobby base-container-create-button">
                                <button 
                                    className="lobby base-container-button" 
                                    disabled={notAbleToStart}
                                    onClick={() => enterGame()}>
                                    Enter Game
                                </button>
                            </div>
                        </Frame>
                    </div>
                </div>
            </div>
            <StrategoSocket topics="/room" onMessage={onMessage}/>
        </div>
    )
}
export default Room;