import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
import {useHistory, useParams} from "react-router-dom";
import OnlineUserList from "../ui/OnlineUserList";
import Myself from "../ui/Myself";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import 'styles/views/Profile.scss'
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
const Profile = props => {

    const history = useHistory();
    const {userId} = useParams();
    const [preUsername, setPreUsername] = useState(null);
    const [username, setUsername] = useState(null);
    const [saved, setSaved] = useState(false);
    const [wins,setWins] = useState(null);
    const [loss, setLoss] = useState(null);
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const profile = (userId) => {
        history.push(`/users/profile/${userId}`);
    }
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
    const returnLobby = async () => {
        try {
            if(saved === false && localStorage.getItem('id') === userId && preUsername!==username) {
                alert("You did not save the changes!");
            }
            history.push('/lobby');
        } catch (error) {
            console.error(`Something went wrong while return to lobby: \n${handleError(error)}`);
            console.error("Details:", error);
        }
    }
    const doEditUsername = async () => {
        try {
            const editUsername = {"username": username.toString()};
            const requestBody = JSON.stringify(editUsername);
            await api.put("/users/" + userId, requestBody);
            setSaved(true);
            alert("Save changes successfully!")
        } catch (error) {
            console.error(`Something went wrong while change username: \n${handleError(error)}`);
            console.error("Details:", error);
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
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchUser() {
            try {
                const response = await api.get("/users/" + userId);
                setUsername(response.data.username);
                setPreUsername(response.data.username);
                setWins(response.data.wins);
                setLoss(response.data.loss);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchUser();

    }, []);
    const unChange = un => {
        if(localStorage.getItem("id") !== userId){
            setUsername(username);}
        else {setUsername(un)}};
    const FormField = props => {
        return (
            <div>
                <label className="profile label">
                    {props.label}
                </label>
                <input
                    className={props.disabled? "profile disabled-input":"profile input"}
                    placeholder={props.label}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
            </div>
        );
    };
    FormField.propTypes = {
        label: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func
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
                {filteredData.length !== 0 && (
                    <div className="lobby dataResult">
                        {filteredData.slice(0, 15).map((value, key) => {
                            return (
                                <div className="lobby dataItem"onClick={() => profile(value.id)}>{value.username}</div>
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
                    <button className="lobby right-home-button" onClick={()=>returnLobby()}>
                        Lobby
                    </button>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Profile
                            </div>
                            <div className="lobby base-container-room-list">
                                <FormField
                                    disabled={true}
                                    label="id"
                                    value={userId}
                                    onChange={()=> alert("You cannot change user id!")}
                                />
                                <FormField
                                    label="username"
                                    value={username}
                                    // onChange={u => {setUsername(u)}}
                                    onChange={unChange}
                                    disabled={localStorage.getItem("id") !== userId}
                                />
                                <div className="profile statistics">
                                    Statistics
                                </div>
                                <FormField
                                    disabled={true}
                                    label="wins"
                                    value={wins}
                                    onChange={()=> alert("You cannot change user statistics!")}
                                />
                                <FormField
                                    disabled={true}
                                    label="loss"
                                    value={loss}
                                    onChange={()=> alert("You cannot change user statistics!")}
                                />

                            </div>
                             <div className="lobby base-container-create-button">
                                {(localStorage.getItem("id") === userId)
                                    ?
                                    <button className="lobby base-container-button"
                                            disabled={!username} onClick={()=> doEditUsername()}>
                                        Save changes
                                    </button>
                                    :
                                    <button className="lobby base-container-button"
                                        onClick={()=> returnLobby()}>
                                        Return
                                    </button>
                                }
                                {/*<button className="lobby base-container-button"*/}
                                {/*disabled={!username || localStorage.getItem("id") !== userId} onClick={()=> doEditUsername()}>*/}
                                {/*    Save changes*/}
                                {/*</button>*/}
                            </div>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile;