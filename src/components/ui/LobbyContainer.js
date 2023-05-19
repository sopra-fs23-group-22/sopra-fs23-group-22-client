import RoomList from "./RoomList";
import "styles/ui/LobbyContainer.scss";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
const LobbyContainer = ()=> {
    const history = useHistory();
    // const [roomIdOfUser, setRoomIdOfUser] = useState(null);
    const roomId = localStorage.getItem('roomId')
    const userId = localStorage.getItem("id");
    const [gameState, setGameState] = useState(null);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchGameState() {
            try {
                const response = await api.get(`/rooms/${roomId}/gameState`);
                setGameState(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the game state: \n${handleError(error)}`);
                console.error("Details:", error);
            }
        }

        fetchGameState();

    }, [roomId]);
    const createARoom = async () => {
        try {
            const user = { id: userId.toString() };
            const requestBody = JSON.stringify(user);
            const response = await api.post("/rooms", requestBody);
            const roomId = response.data.roomId;
            localStorage.setItem("roomId", roomId);
            history.push(`/rooms/${roomId}`);
        } catch (error) {
            console.error(
                `Something went wrong while create a room: \n${handleError(error)}`
            );
            console.error("Details:", error);
            alert(
                "Something went wrong while create a room! See the console for details."
            );
        }
    };
    return (
        <div className="LobbyContainer">
            <div className="LobbyContainer-title">
                Rooms
            </div>
            <RoomList/>
            <div className="LobbyContainer-buttonArea">
                <button className="LobbyContainer-button"
                        onClick={ () => {
                            if(roomId === null) {
                                createARoom()
                            } else if(gameState ===  "PRE_PLAY"){
                                alert("You are already in a room!");
                                history.push(`/rooms/${roomId}/preparing/players/${userId}`);
                            } else if(gameState === "IN_PROGRESS") {
                                alert("You are already in a room!");
                                history.push(`/rooms/${roomId}/game/players/${userId}`)
                            } else if(gameState === "WAITING") {
                                alert("You are already in a room!");
                                history.push(`/rooms/${roomId}`); 
                            }

                        }}>
                    Create Room
                </button>
            </div>
        </div>
    );
}
export default LobbyContainer;