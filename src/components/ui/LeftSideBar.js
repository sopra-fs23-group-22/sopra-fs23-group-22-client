import "../../styles/views/Lobby.scss";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Myself from "../ui/Myself";
import OnlineUserList from "../ui/OnlineUserList";
import PlayerList from "./PlayerList";

const SearchBox = ({ renderSearchBox, users }) => {
  const history = useHistory();
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const profile = (userId) => {
    history.push(`/users/profile/${userId}`);
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = users.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  if (renderSearchBox) {
    return (
      <div>
        <div className="lobby left-search-user">
          <input
            className="lobby left-search-input"
            type="text"
            placeholder="Enter a Username"
            value={wordEntered}
            onChange={handleFilter}
          />
          <div className="lobby left-search-icon">
            {filteredData.length === 0 ? (
              <SearchIcon />
            ) : (
              <CloseIcon onClick={clearInput} />
            )}
          </div>
        </div>
        {filteredData.length != 0 && (
          <div className="lobby dataResult">
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <div
                  className="lobby dataItem"
                  onClick={() => profile(value.id)}
                >
                  {value.username}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="lobby left-search-user">
        <div className="lobby left-search-input" />
      </div>
    );
  }
};

const LeftSideBar = ({ isRenderSearchBox, upperList }) => {
  const [users, setUsers] = useState(null);
  let upperContent = null;

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchUsers();
  }, []);

  if (upperList === "players") {
    upperContent = (
      <div className="lobby online-users-container">
        <div className="lobby online-users-title">Players</div>
        <div className="lobby online-users-list">
          <PlayerList />
        </div>
      </div>
    );
  } else {
    upperContent = (
      <div className="lobby online-users-container">
        <div className="lobby online-users-title">Online Users</div>
        <div className="lobby online-users-list">
          <Myself />
          <OnlineUserList />
        </div>
      </div>
    );
  }

  return (
    <div className="lobby left">
      <SearchBox renderSearchBox={isRenderSearchBox} users={users} />
      <div className="lobby left-down-side">
        {upperContent}
        <div className="lobby online-users-container">
          <div className="lobby online-users-title">Friends</div>
          <div className="lobby online-users-list">Friend List</div>
        </div>
      </div>
    </div>
  );
};
export default LeftSideBar;
