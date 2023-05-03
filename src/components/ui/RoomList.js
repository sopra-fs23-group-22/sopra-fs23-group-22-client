import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";
import {Spinner} from "./Spinner";
import StrategoSocket from "../socket/StrategoSocket";
import {useHistory} from "react-router-dom";

const RoomList = props => {
    const history = useHistory();
    const roomList = (msg) => {
        console.log(msg);
        setRooms(msg.filter(m =>m.userIds.length === 0 || m.userIds.length === 1));
        setFullRooms(msg.filter(m =>m.userIds.length === 2));
    }
    const FullRooms = ({room}) => (
        <div>
            <div className="lobby room-list-rooms"> Room{room.roomId} ({room.userIds.length}/2)</div>
            <div className="lobby room-list-number-progress" > In progress </div>
        </div>
    );
    FullRooms.propTypes = {
        room: PropTypes.object
    };
    const Rooms = ({room}) => (
        <div>
            <div className="lobby room-list-rooms"> Room{room.roomId} ({room.userIds.length}/2)</div>
            <div className="lobby room-list-number" onClick={ async () => {await joinARoom(room.roomId)}}> Join </div>
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
            const userId = localStorage.getItem("id");
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

    let RoomListContent = <Spinner/>
    if(rooms||fullRooms) {
        RoomListContent = (
            <div className="lobby online-users-list">
                <li>
                    {rooms.map(room => (
                        <Rooms room={room} key={room.roomId}/>
                    ))}
                </li>
                <li>
                    {fullRooms.map(room => (
                        <FullRooms room={room} key={room.roomId}/>
                    ))}
                </li>
            </div>
        );
    }
    return(
        <div>
            {RoomListContent}
            <StrategoSocket
                topics="/rooms"
                onMessage={roomList}
            />
        </div>
    )
}
export default RoomList;