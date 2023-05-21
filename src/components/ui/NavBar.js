import "../../styles/views/Whole.scss";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import "../../styles/ui/NavBar.scss";
const NavBar = (props) => {
  const history = useHistory();

  const doLogout = async () => {
    try {
      const logout = { status: "OFFLINE" };
      const requestBody = JSON.stringify(logout);

      const userId = localStorage.getItem("id");
      if (localStorage.getItem("roomId")) {
        const roomId = localStorage.getItem("roomId");
        const removeUser = { id: userId.toString() };
        const logoutUser = JSON.stringify(removeUser);
        await api.put(`/rooms/${roomId}/remove`, logoutUser);
      }
      await api.put("/users/" + userId, requestBody);
      localStorage.clear();
      history.push("/login");
    } catch (error) {
      console.error(
        `Something went wrong while logout: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert("Something went wrong while logout! See the console for details.");
    }
  };

  const returnLobbyForRoom = async () => {
    try {
      const userId = localStorage.getItem("id");
      const roomId = localStorage.getItem("roomId");
      const removeUser = { id: userId.toString() };
      const requestBody = JSON.stringify(removeUser);
      await api.put(`/rooms/${roomId}/remove`, requestBody);
      localStorage.removeItem("roomId");
      localStorage.removeItem("roomState");
      history.push("/lobby");
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while return to lobby! See the console for details."
      );
    }
  };
  const returnLobbyForProfile = async () => {
    try {
      history.push("/lobby");
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
    }
  };
  const returnRoomForProfile = async () => {
    try {
      const roomId = localStorage.getItem("roomId");
      history.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
    }
  };
  const lobbyBtn = (renderLobbyBtn) => {
    if (renderLobbyBtn === "forRoom") {
      return (
        <div className="lobby-button" onClick={() => returnLobbyForRoom()}>
          Lobby
        </div>
      );
    } else if (renderLobbyBtn === "forProfile") {
      if (localStorage.getItem("roomId") !== null) {
        return (
          <div className="lobby-button" onClick={() => returnRoomForProfile()}>
            RETURN ROOM
          </div>
        );
      } else {
        return (
          <div className="lobby-button" onClick={() => returnLobbyForProfile()}>
            LOBBY
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const logoutBtn = (renderLogoutBtn) => {
    if (renderLogoutBtn) {
      return (
        <div className="logout-button" onClick={() => doLogout()}>
          LOGOUT
        </div>
      );
    }
  };

  return (
    <div className="nav">
      {lobbyBtn(props.renderLobbyBtn)}
      {logoutBtn(props.renderLogoutBtn)}
    </div>
  );
};
export default NavBar;
