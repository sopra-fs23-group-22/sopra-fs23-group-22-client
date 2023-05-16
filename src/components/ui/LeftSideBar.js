import "../../styles/ui/LeftSideBar.scss";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import Myself from "../ui/Myself";
import OnlineUserList from "../ui/OnlineUserList";
import PlayerList from "./PlayerList";

const LeftSideBar = ({ isRenderSearchBox, upperList }) => {
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
            {/*<div>*/}
              <input
                  className="input"
                  type="text"
                  placeholder="Enter a Username"
                  value={wordEntered}
                  onChange={handleFilter}
              />
              <div className="icon">
                {filteredData.length === 0 ? (
                    <SearchIcon className="icon svg"/>
                ) : (
                    <CloseIcon className="icon svg" onClick={clearInput} />
                )}
              {/*</div>*/}
            </div>
            {filteredData.length != 0 && (
                <div className="dataResult">
                  {filteredData.slice(0, 15).map((value, key) => {
                    return (
                        <div
                            className="dataItem"
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
          <div className="search">
            <div className="input" />
          </div>
      );
    }
  };

  const [users, setUsers] = useState(null);
  let listContent = null;

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
    listContent = (
        <div className="up">
          <div className="up-title">
            Players
          </div>
          <div className="up up-content-players">
            <PlayerList />
          </div>
        </div>
    );
  } else {
    listContent = (
        <div className="up">
          <div className="up-title">
            Online Users
          </div>
          <div className="up up-content-users">
            <Myself/>
            <OnlineUserList/>
          </div>
        </div>
    );
  }

  return (
      <div className="left">
        <SearchBox renderSearchBox={true}/>
        {/*<div className="up">*/}
          {/*<div className="up-title">*/}
          {/*  Online Users*/}
          {/*</div>*/}
          {/*{listContent}*/}
        {/*</div>*/}
        {listContent}
        {/*<div className="down">*/}
        {/*  <div className="down-title">*/}
        {/*    Invitations*/}
        {/*  </div>*/}
        {/*  <div className="down-content">*/}
        {/*    Content*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

  );
};
export default LeftSideBar;