import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";
import StrategoSocket from 'components/socket/StrategoSocket';
import OnlineUserList from "../ui/OnlineUserList";
import Myself from "../ui/Myself";
import RoomList from "../ui/RoomList";
const Lobby = props => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const doLogout = async () => {
        try {
            const logout = {"status": "OFFLINE"};
            const requestBody = JSON.stringify(logout);

            const userId = localStorage.getItem('id');
            const response = await api.put("/users/" + userId, requestBody);
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            history.push('/login');
        } catch (error) {
            console.error(`Something went wrong while logout: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while logout! See the console for details.");
        }

    }
    const createARoom = async () => {
        try{
            const userId = localStorage.getItem("id");
            const user = {"id":userId.toString()};
            const requestBody = JSON.stringify(user);
            const response = await api.post("/rooms", requestBody);
            const roomId = response.data.roomId;
            localStorage.setItem('roomId', roomId);
            history.push('/room');
        } catch (error) {
            console.error(`Something went wrong while create a room: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while create a room! See the console for details.");
        }
    }


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchUsers() {
            try {
                const response = await api.get('/users');
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchUsers();

    }, []);


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
    return (
        <div className="lobby row">
            <div className="lobby left">
                <div className="lobby left-search-user">
                    <input className="lobby left-search-input"
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
                                <div className="lobby dataItem">{value.username}</div>
                            );
                        })}
                    </div>
                )}
                <div className="lobby left-down-side">
                    <div className="lobby online-users-container">
                        <div className="lobby online-users-title">
                            Online Users
                        </div>
                        <div className="lobby online-users-list">
                            <Myself/>
                            <OnlineUserList/>
                        </div>
                    </div>
                    <div className="lobby online-users-container">
                        <div className="lobby online-users-title">
                            Friends
                        </div>
                        <div className="lobby online-users-list">
                            Friend List
                        </div>
                    </div>
                </div>
            </div>
            <div className="lobby right">
                <div className="lobby right-header">
                    <div className="lobby right-logout-button" onClick={() => doLogout()}>
                        Logout
                    </div>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Rooms
                            </div>
                            <div className='lobby base-container-line'>
                            </div>
                            <div className="lobby base-container-room-list">
                                <RoomList/>
                            </div>
                            <div className="lobby base-container-create-button">
                                <button className="lobby base-container-button" onClick={() => createARoom()}>
                                    Create A Room
                                </button>
                            </div>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Lobby;