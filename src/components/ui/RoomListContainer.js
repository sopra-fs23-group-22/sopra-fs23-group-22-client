import RoomList from "./RoomList";
import "styles/ui/RoomListContainer.scss";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
const RoomListContainer = ()=> {
    const history = useHistory();
    const [roomIdOfUser, setRoomIdOfUser] = useState(null);
    const userId = localStorage.getItem("id");
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchIsInRoom() {
            try {
                const response = await api.get(`/users/${userId}`);
                setRoomIdOfUser(response.data.roomId);
            } catch (error) {
                console.error(`Something went wrong while fetching the user' roomId: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user' roomId! See the console for details.");
            }
        }

        fetchIsInRoom();

    }, []);
    const createARoom = async () => {
        try {
            const user = { id: userId.toString() };
            const requestBody = JSON.stringify(user);
            const response = await api.post("/rooms", requestBody);
            const roomId = response.data.roomId;
            localStorage.setItem("roomId", roomId);
            // history.push('room/${roomId}')
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
        <div className="container">
            <div className="title">
                Rooms
            </div>
            <RoomList/>
            <div className="buttonArea">
                <button className="button"
                        onClick={ () => {
                            if(roomIdOfUser === null) {
                                createARoom()
                            } else {
                                alert("You are already in a room!")
                                history.push(`/rooms/${roomIdOfUser}`)}
                        }}>
                    create a room
                </button>
            </div>
        </div>
    );
}
export default RoomListContainer;