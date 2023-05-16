import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";
import {Spinner} from "./Spinner";
import StrategoSocket from "../socket/StrategoSocket";
import {useHistory} from "react-router-dom";
import "../../styles/ui/LobbyContainer.scss";
const RoomList = props => {
    const history = useHistory();
    const [roomIdOfUser, setRoomIdOfUser] = useState(null);
    const userId = localStorage.getItem("id");
    const roomList = (msg) => {
        console.log(msg);
        setRooms(msg.filter(m =>m.userIds.length === 0 || m.userIds.length === 1));
        setFullRooms(msg.filter(m =>m.userIds.length === 2));
    }
    const FullRooms = ({room}) => (
        <div className="item">
            <div className="item-roomId"> Room{room.roomId} ({room.userIds.length}/2)</div>
            <div className="item item-progress" > In progress </div>
        </div>
    );
    FullRooms.propTypes = {
        room: PropTypes.object
    };
    const Rooms = ({room}) => (
        <div className="item">
            <div className="item-roomId"> Room{room.roomId} ({room.userIds.length}/2)</div>
            <div className="item item-join" onClick={ () => {
                if(roomIdOfUser === null) {joinARoom(room.roomId)}
                else {
                    alert("You are already in a room!")
                    history.push(`/rooms/${roomIdOfUser}`)
                }
            }}> Join </div>
        </div>
    );
    Rooms.propTypes = {
        room: PropTypes.object
    };
    /* CHANGE HERE: change the initial state of rooms from null to empty array,
            in order to solve the problem of using map on null
            (this bug always happens when deploying on cloud with TypeError: a.map is not a function) */
    const [rooms, setRooms] = useState([]);
    const [fullRooms, setFullRooms] = useState([]);

    const joinARoom = async (roomId) => {
        try {
            const user = {"id":userId.toString()};
            const requestBody = JSON.stringify(user);
            const response = await api.put(`/rooms/${roomId}/add`, requestBody);
            localStorage.setItem('roomId', roomId);
            history.push(`/rooms/${roomId}`);
        }
        catch (error) {
            console.error(`Something went wrong while joining a room: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while joining a room! See the console for details.");
        }
    }
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
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchRooms() {
            try {
                const response = await api.get("/rooms");
                const roomObject = response.data;
                console.log(roomObject[0]);
                // const roomList = convertObjectToArray(roomObject);
                const roomList = roomObject;
                // console.log(Object.values(roomObject))
                // console.log(typeof(Object.values(roomObject)));
                console.log(typeof(roomList));
                console.log(roomList);
                // setRooms(roomList);
                setRooms(roomList.filter(m =>m.userIds.length === 0 || m.userIds.length === 1));
                setFullRooms(roomList.filter(m =>m.userIds.length === 2));
            } catch (error) {
                console.error(`Something went wrong while fetching the rooms: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the rooms! See the console for details.");
            }
        }

        fetchRooms();

    }, []);

    function convertObjectToArray(targetObject) {
        const arr = []
        arr.push()
        for(let i=0; i<targetObject.length; i++) {
            arr.push(targetObject[i]);
        }
        return arr;
    }
    let RoomListContent = <Spinner/>;
    let Rooms_spare = <Spinner/>;
    let Rooms_full = <Spinner/>;
    if(rooms||fullRooms) {
        RoomListContent = (
            <div className="players">
                <li className="list">
                    {rooms.map(room => (
                        <Rooms room={room} key={room.roomId}/>
                    ))}
                </li>
                <li className="list">
                    {fullRooms.map(room => (
                        <FullRooms room={room} key={room.roomId}/>
                    ))}
                </li>
            </div>
        );
    }
    if(rooms) {
        Rooms_spare = (
            <li className="list">
                {rooms.map(room => (
                    <Rooms room={room} key={room.roomId}/>
                ))}
            </li>
        );
    }
    if(fullRooms) {
        Rooms_full = (
            <li className="list">
                {fullRooms.map(room => (
                    <Rooms room={room} key={room.roomId}/>
                ))}
            </li>
        );
    }
    return(
        <div className="content">
            {RoomListContent}
            {/*{Rooms_spare}*/}
            <StrategoSocket
                topics="/rooms"
                onMessage={roomList}
            />
        </div>
    )
}
export default RoomList;