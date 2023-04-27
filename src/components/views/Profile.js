import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

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
        <div className="lobby user-myself-edit"> Edit </div>
    </div>
);
Myself.propTypes = {
    user: PropTypes.object
};

const Lobby = props => {

    const history = useHistory();

    const [myself, setMyself] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');
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

    let content = <Spinner/>;

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

    return (
        <div className="lobby row">
            <div className="lobby left">
                <div className="lobby left-search-user">
                </div>
                <div className="lobby left-down-side">
                    <div className="lobby online-users-container">
                        <div className="lobby online-users-title">
                            Online Users
                        </div>
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
                    <button className="lobby right-home-button">
                        Home
                    </button>
                    <button className="lobby right-logout-button" onClick={() => logout()}>
                        Logout
                    </button>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Someone's profile
                            </div>
                            <div className="lobby base-container-room-list">
                                personal information
                            </div>
                            <button className="lobby base-container-create-button">
                                Edit
                            </button>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Lobby;