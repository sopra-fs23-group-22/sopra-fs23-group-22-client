import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import PropTypes from "prop-types";
import { Spinner } from "./Spinner";
import StrategoSocket from "../socket/StrategoSocket";
import { useHistory } from "react-router-dom";
import "../../styles/ui/LobbyContainer.scss";
import { Button } from "./Button";

const RoomList = (props) => {
  const history = useHistory();
  const [roomId, setRoomId] = useState(localStorage.getItem('roomId'));
  const userId = localStorage.getItem("id");
  const [gameState, setGameState] = useState(null);
  const onMessage = (msg) => {
    console.log(msg);
    setRoomId(msg.roomId);
  }
  useEffect(() => {

    async function fetchUser() {
      
      try {
        const response = await api.get(`/users/${userId}`);
        const userObject = response.data;
        setRoomId(userObject.roomId);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the user: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
      }
      
    }

    fetchUser();
  }, []);
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchGameState() {
      if(localStorage.getItem('roomId') !== null) {
        try {
          const response = await api.get(`/rooms/${roomId}/gameState`);
          setGameState(response.data);
        } catch (error) {
          console.error(
            `Something went wrong while fetching the game state: \n${handleError(
              error
            )}`
          );
          console.error("Details:", error);
        }
      }
    }

    fetchGameState();
  }, [roomId]);
  const roomList = (msg) => {
    console.log(msg);
    setRooms(
      msg.filter((m) => m.userIds.length === 0 || m.userIds.length === 1)
    );
    setFullRooms(msg.filter((m) => m.userIds.length === 2));
  };
  const FullRooms = ({ room }) => (
    <div className="LobbyContainer-item">
      <div className="LobbyContainer-item-roomId">
        {" "}
        Room{room.roomId} ({room.userIds.length}/2)
      </div>
      <Button
        className="LobbyContainer-item item-progress"
        style={{ width: "180px" }}
        disabled={true}
      >
        {" "}
        In progress{" "}
      </Button>
    </div>
  );
  FullRooms.propTypes = {
    room: PropTypes.object,
  };
  const Rooms = ({ room }) => (
    <div className="LobbyContainer-item">
      <div className="LobbyContainer-item-roomId">
        {" "}
        Room{room.roomId} ({room.userIds.length}/2)
      </div>
      <Button
        // className="LobbyContainer-item item-join"
        style={{ width: "180px" }}
        disabled={roomId!==null}
        onClick={() => {
          if (roomId === null) {
            joinARoom(room.roomId);
          } else if (gameState === "PRE_PLAY") {
            alert("You are already in a room!");
            history.push(`/rooms/${roomId}/preparing/players/${userId}`);
          } else if (gameState === "IN_PROGRESS") {
            alert("You are already in a room!");
            history.push(`/rooms/${roomId}/game/players/${userId}`);
          } else if (gameState === "WAITING") {
            alert("You are already in a room!");
            history.push(`/rooms/${roomId}`);
          }
        }}
      >
        {" "}
        Join{" "}
      </Button>
    </div>
  );
  Rooms.propTypes = {
    room: PropTypes.object,
  };
  /* CHANGE HERE: change the initial state of rooms from null to empty array,
            in order to solve the problem of using map on null
            (this bug always happens when deploying on cloud with TypeError: a.map is not a function) */
  const [rooms, setRooms] = useState([]);
  const [fullRooms, setFullRooms] = useState([]);

  const joinARoom = async (roomId) => {
    try {
      const user = { id: userId.toString() };
      const requestBody = JSON.stringify(user);
      await api.put(`/rooms/${roomId}/add`, requestBody);
      localStorage.setItem("roomId", roomId);
      history.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(
        `Something went wrong while joining a room: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while joining a room! See the console for details."
      );
    }
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchRooms() {
      try {
        const response = await api.get("/rooms");
        const roomObject = response.data;
        console.log(roomObject[0]);
        const roomList = roomObject;
        console.log(typeof roomList);
        console.log(roomList);
        setRooms(
          roomList.filter(
            (m) => m.userIds.length === 0 || m.userIds.length === 1
          )
        );
        setFullRooms(roomList.filter((m) => m.userIds.length === 2));
      } catch (error) {
        console.error(
          `Something went wrong while fetching the rooms: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the rooms! See the console for details."
        );
      }
    }

    fetchRooms();
  }, []);

  let RoomListContent = <Spinner />;
  
  if (rooms || fullRooms) {
    RoomListContent = (
      <div className="LobbyContainer-players">
        <li className="LobbyContainer-list">
          {rooms.map((room) => (
            <Rooms room={room} key={room.roomId} />
          ))}
        </li>
        <li className="LobbyContainer-list">
          {fullRooms.map((room) => (
            <FullRooms room={room} key={room.roomId} />
          ))}
        </li>
      </div>
    );
  }
  
  return (
    <div className="LobbyContainer-content">
      {RoomListContent}
      <StrategoSocket topics="/rooms" onMessage={roomList} />
      <StrategoSocket topics={`/users/${userId}`} onMessage={onMessage} />
    </div>
  );
};
export default RoomList;
