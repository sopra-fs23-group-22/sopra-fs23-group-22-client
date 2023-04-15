import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

// const OnlineUsers = ({user}) => (
//
//     <div>
//       <div className="lobby user-myself-username">{user.username}</div>
//       <div className="lobby user-myself-edit"> Chat </div>
//       {/* <img className="lobby user-myself-edit" alt= "box" src="https://cdn-icons-png.flaticon.com/512/3745/3745484.png"></img> */}
//     </div>
// );
//
// OnlineUsers.propTypes = {
//     user: PropTypes.object
// };
//
// const Myself = ({user}) => (
//     <div>
//         <div className="lobby user-myself-username">{user.username}</div>
//         {/* <img className="lobby user-myself-edit" alt="edit" src="https://thenounproject.com/icon/edit-button-4888376/"></img> */}
//         <div className="lobby user-myself-edit" onClick={() => profile()}> Edit </div>
//     </div>
// );
// Myself.propTypes = {
//     user: PropTypes.object
// };

const Lobby = props => {
    const history = useHistory();
    const OnlineUsers = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            <div className="lobby user-myself-edit"> Chat </div>
            {/* <img className="lobby user-myself-edit" alt= "box" src="https://cdn-icons-png.flaticon.com/512/3745/3745484.png"></img> */}
        </div>
    );

    OnlineUsers.propTypes = {
        user: PropTypes.object
    };

    const Myself = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            {/* <img className="lobby user-myself-edit" alt="edit" src="https://thenounproject.com/icon/edit-button-4888376/"></img> */}
            <div className="lobby user-myself-edit" onClick={() => profile()}> Edit </div>
        </div>
    );
    Myself.propTypes = {
        user: PropTypes.object
    };

    const [myself, setMyself] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

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

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }
    const profile = () => {
        history.push('/profile');
    }
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchMyself() {
            try {
                // const userId = JSON.parse(localStorage.getItem('id'));
                const userId = localStorage.getItem('id');
                // const userId = history.location.state.id;
                // const { id } = props.match.params;
                const response = await api.get("/users/" + userId);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setMyself(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.

                // See here to get more data.

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

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setOnlineUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.

                // See here to get more data.

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

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.

                // See here to get more data.

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchUsers();

    }, []);

    let content = <Spinner/>;
    // let content2 = <Spinner/>;

    if (onlineUsers && myself) {
        content = (
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
    // if (myself) {
    //     content2 = (
    //     <div className="lobby online-users-myself">
    //         <ul>
    //             <Myself user={myself} key={myself.id}/>
    //         </ul>
    //     </div>
    //     );
    // }
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
                        {/* {content2} */}
                        {content}
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
                    <div className="lobby right-home-button">
                        Home
                    </div>
                    <div className="lobby right-logout-button" onClick={() => logout()}>
                        Logout
                    </div>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Rooms
                            </div>
                            <div className="lobby base-container-room-list">
                                Room 1
                            </div>
                            <div className="lobby base-container-create-button">
                                <button className="lobby base-container-button">
                                    Create A Room
                                </button>
                            </div>
                            {/*<div className="lobby x">*/}
                            {/*    X*/}
                            {/*</div>*/}
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Lobby;