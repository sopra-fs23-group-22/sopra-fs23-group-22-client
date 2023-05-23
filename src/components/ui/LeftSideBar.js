import "../../styles/ui/LeftSideBar.scss";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Myself from "../ui/Myself";
import OnlineUserList from "../ui/OnlineUserList";
import PlayerList from "./PlayerList";
import StrategoSocket from "components/socket/StrategoSocket";

const LeftSideBar = ({ isRenderSearchBox, upperList }) => {
  const [users, setUsers] = useState(null);
  const roomId = localStorage.getItem("roomId");

  const onMessage = (msg) => {
    console.log(msg);
    setUsers(msg);
  };
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
        <div className="search">
          <input
            className="search input"
            type="text"
            placeholder="Enter a Username"
            value={wordEntered}
            onChange={handleFilter}
          />
          <div className="search icon">
            {filteredData.length === 0 ? (
              <SearchIcon className="icon svg" />
            ) : (
              <CloseIcon className="icon svg" onClick={clearInput} />
            )}
          </div>
          {filteredData.length !== 0 && (
            <div className="dataResult">
              {filteredData.slice(0, 15).map((value, key) => {
                return (
                  <div className="dataItem" onClick={() => profile(value.id)}>
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
        <div className="search">
          <div className="input" />
        </div>
      );
    }
  };

  let listContent = null;

  useEffect(() => {
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
    listContent = (
      <div className="up">
        <div className="up-title">PLAYERS</div>
        <div className="up up-content-players">
          <PlayerList roomId={roomId} />
        </div>
      </div>
    );
  } else {
    listContent = (
      <div className="up">
        <div className="up-title">ONLINE USERS</div>
        <div className="up up-content-users">
          <Myself />
          <OnlineUserList />
        </div>
      </div>
    );
  }

  return (
    <div className="leftSideContainer">
      <SearchBox renderSearchBox={isRenderSearchBox} users={users} />
      {listContent}
      <StrategoSocket topics="/users" onMessage={onMessage} />
    </div>
  );
};
export default LeftSideBar;
