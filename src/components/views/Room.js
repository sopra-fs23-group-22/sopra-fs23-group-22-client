import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";


const Lobby = props => {

    const history = useHistory();
    const OnlineUsers = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            <div className="lobby user-myself-edit"> Chat </div>
        </div>
    );

    OnlineUsers.propTypes = {
        user: PropTypes.object
    };

    const Myself = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            <div className="lobby user-myself-edit" onClick={() => profile()}> Edit </div>
        </div>
    );
    Myself.propTypes = {
        user: PropTypes.object
    };
    const Rooms = ({room}) => (
        // const buttonContent = room.players.length === 1 ? 'Join': 'In progress';
        <div>
            <div className="lobby room-list-rooms">{room.roomId}</div>
            <div className="lobby room-list-number">{room.userIds.length}/2</div>
            {/*<button className="lobby user-myself-edit"> {room.players.length === 1 ? 'Join': 'In progress'}</button>*/}
        </div>
    );
    Rooms.propTypes = {
        room: PropTypes.object
    };
    const [myself, setMyself] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [rooms, setRooms] = useState(null);
    const [playerIds, setPlayerIds] = useState([]);
    const [players, setPlayers] = useState([]);
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

    const doLogout = async () => {
        try {
            const logout = {"status": "OFFLINE"};
            const requestBody = JSON.stringify(logout);

            const userId = localStorage.getItem('id');
            const response = await api.put("/users/" + userId, requestBody);
            localStorage.removeItem('token');
            history.push('/login');
        } catch (error) {
            console.error(`Something went wrong while logout: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while logout! See the console for details.");
        }

    }
    const returnLobby = async () => {
        try {
            const userId = localStorage.getItem("id");
            const roomId = localStorage.getItem("roomId");
            const removeUser = {"id":userId.toString()};
            const requestBody = JSON.stringify(removeUser);
            const response = await api.put("/rooms/remove/" + roomId, requestBody);
            history.push('/lobby');
        } catch (error) {
            console.error(`Something went wrong while return to lobby: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while return to lobby! See the console for details.");
        }
    }
    const profile = () => {
        history.push('/profile');
    }
    const startGame =  async () => {
        history.push('/gamePreparing');
    }
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchMyself() {
            try {
                const userId = localStorage.getItem('id');
                const response = await api.get("/users/" + userId);
                setMyself(response.data);
                localStorage.setItem('username', response.data.username);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchMyself();

    }, []);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchOnlineUsers() {
            try {
                const response = await api.get('/users/online');
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOnlineUsers(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchOnlineUsers();

    }, []);
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
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchRooms() {
            try {
                const response = await api.get("/rooms");
                setRooms(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the rooms: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the rooms! See the console for details.");
            }
        }

        fetchRooms();

    }, []);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchPlayers() {
            try {
                const roomId = localStorage.getItem('roomId');
                const thisRoom = await api.get("/rooms/" + roomId);
                setPlayerIds(thisRoom.data.userIds);

            } catch (error) {
                console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the players! See the console for details.");
            }
        }
        fetchPlayers();
    },[]);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchPlayer1() {
            try {
                const userId = playerIds.get(0);
                const response = await api.get("/users/" + userId);
                setPlayers(players.add(response.data));
            } catch (error) {
                console.error(`Something went wrong while fetching the player1: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the player1! See the console for details.");
            }
        }
        fetchPlayer1();
    },[]);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchPlayer2() {
            try {
                const userId = playerIds.get(1);
                const response = await api.get("/users/" + userId);
                setPlayers(players.add(response.data));
            } catch (error) {
                console.error(`Something went wrong while fetching the player2: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the player2! See the console for details.");
            }
        }
        fetchPlayer2();
    },[]);
    let onlineContent = <Spinner/>;
    if (onlineUsers && myself) {
        onlineContent = (
            <div className="lobby online-users-list">
                <Myself user={myself} key={myself.id}/>
                <ul>
                    {onlineUsers.map(user => (
                        <OnlineUsers user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        );
    }
    let playersContent = <Spinner/>;
    if(players) {
        playersContent = (
            <ul>
                {players.map(user => (
                    <OnlineUsers user={user} key={user.id}/>
                ))}
            </ul>
        )
    }
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
                {filteredData.length !== 0 && (
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
                        {onlineContent}
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
                    <div className="lobby right-home-button" onClick={() => returnLobby()}>
                        Lobby
                    </div>
                    <div className="lobby right-logout-button" onClick={() => doLogout()}>
                        Logout
                    </div>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Room{localStorage.getItem('roomId')}
                            </div>
                            <div className='lobby base-container-line'>
                            </div>
                            <div className="lobby base-container-room-list">
                                <div className="lobby user-list-username">
                                    {playersContent}
                                </div>
                            </div>
                            <div className="lobby base-container-create-button">
                                <button className="lobby base-container-button" onClick={() => startGame()}>
                                    Start Game
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