import "styles/views/Lobby.scss";
import Frame from "../ui/Frame";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import RoomList from "../ui/RoomList";
import RulePopUp from "components/ui/RulePopUp";
import LeftSideBar from "components/ui/LeftSideBar";
import NavBar from "components/ui/NavBar";
import {useEffect, useState} from "react";

const Lobby = (props) => {
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
    <div className="lobby row">
      <LeftSideBar isRenderSearchBox={true} />
      <div className="lobby right">
        <NavBar renderLobbyBtn={false} renderLogoutBtn={true} />
        <div className="lobby right-main">
          <div className="lobby right-info-container">
            <RulePopUp />
          </div>
          <div className="lobby right-base-container">
            <Frame>
              <div className="lobby base-container-tile">Rooms</div>
              <div className="lobby base-container-line"></div>
              <div className="lobby base-container-room-list">
                <RoomList />
              </div>
              <div className="lobby base-container-create-button">
                <button
                  className="lobby base-container-button"
                  onClick={ () => {
                  if(roomIdOfUser === null) {
                    createARoom()
                  } else {
                    alert("You are already in a room!")
                    history.push(`/rooms/${roomIdOfUser}`)}
                  }}
                >
                  Create A Room
                </button>
              </div>
            </Frame>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Lobby;
