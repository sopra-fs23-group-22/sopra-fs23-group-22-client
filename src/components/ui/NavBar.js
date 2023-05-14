import "../../styles/views/Lobby.scss";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";

const NavBar = (props) => {
  //   const [renderLobbyBtn, renderLogoutBtn] = props;

  const history = useHistory();

  const doLogout = async () => {
    try {
      const logout = { status: "OFFLINE" };
      const requestBody = JSON.stringify(logout);

      const userId = localStorage.getItem("id");
      const response = await api.put("/users/" + userId, requestBody);
      localStorage.removeItem("token");
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
      // if (
      //     saved === false &&
      //     localStorage.getItem("id") === userId &&
      //     preUsername !== username
      // ) {
      //   alert("You did not save the changes!");
      // }
      history.push("/lobby");
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
        <div className="lobby right-home-button" onClick={() => returnLobbyForRoom()}>
          Lobby
        </div>
      );
    } else if(renderLobbyBtn === "forProfile") {
      return (
          <div className="lobby right-home-button" onClick={() => returnLobbyForProfile()}>
            Lobby
          </div>
      );
    } else {
      return null;
    }
  };

  const logoutBtn = (renderLogoutBtn) => {
    if (renderLogoutBtn) {
      return (
        <div className="lobby right-logout-button" onClick={() => doLogout()}>
          Logout
        </div>
      );
    }
  };

  return (
    <div className="lobby right-header">
      {lobbyBtn(props.renderLobbyBtn)}
      {logoutBtn(props.renderLogoutBtn)}
    </div>
  );
};
export default NavBar;
