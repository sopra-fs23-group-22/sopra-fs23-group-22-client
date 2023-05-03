import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import {useHistory, useParams} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
// import PropTypes from "prop-types";
import OnlineUserList from "../ui/OnlineUserList";
import Myself from "../ui/Myself";
import PlayerList from "../ui/PlayerList";


const Room = props => {

    const {id} = useParams();

    const history = useHistory();
    const doLogout = async () => {
        try {
            const logout = {"status": "OFFLINE"};
            const requestBody = JSON.stringify(logout);
            const userId = localStorage.getItem('id');
            const response = await api.put("/users/" + userId, requestBody);
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
            const response = await api.put("/rooms/remove/" + roomId, requestBody);
            localStorage.removeItem('roomId');
            history.push('/lobby');
        } catch (error) {
            console.error(`Something went wrong while return to lobby: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while return to lobby! See the console for details.");
        }
    }
    const startGame = () => {
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
                                Room{id}
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
                                <button className="lobby base-container-button" onClick={() => startGame()}>
                                    Start Game
                                </button>
                            </div>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Room;