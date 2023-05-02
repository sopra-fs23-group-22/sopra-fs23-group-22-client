import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Spinner} from "./Spinner";
import StrategoSocket from "../socket/StrategoSocket";
import {api, handleError} from "../../helpers/api";

const OnlineUserList = props => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    const onlineUserList = (msg) => {
        /* CHANGE HERE: m.id (what we fetched from server) is of type number,
                        localStorage.getItem('id') is of type string,
                        so the filter does not really work */
        // console.log(`send from server: ${typeof(msg[0].id)}`);
        // console.log(typeof(localStorage.getItem('id')))
        setOnlineUsers(msg.filter(m =>JSON.stringify(m.id) != localStorage.getItem('id')));
    }
    
    // CHANGE HERE: rename the const OnlineUsers to UserInfo, to avoid the ambiguity
    const UserInfo = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            <div className="lobby user-myself-edit"> Chat </div>
        </div>
    );

    UserInfo.propTypes = {
        user: PropTypes.object
    };
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchOnlineUsers() {
            try {
                const response = await api.get('/users/online');
                console.log(response.data);
                /* CHANGE HERE: Set the state of online users after the first render.
                                Here we encounter the bug when useEffect runs (the first time render the page),
                                only the user him/herself will be shown, and the list will not be updated unless server sends a message.
                                Now we can show all online users every time we render the lobby page without waiting for server to send message*/
                setOnlineUsers(response.data.filter(m =>JSON.stringify(m.id) != localStorage.getItem('id')));
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchOnlineUsers();
    }, []);

    let listContent2 = <Spinner/>;
    if (onlineUsers) {
        listContent2 = (
            <ul>
                {onlineUsers.map(user => (
                    <UserInfo user={user} key={user.id}/>
                ))}
            </ul>
        );
    }
    return(
        <div>
            {listContent2}
            <StrategoSocket topics="/users/online" onMessage={onlineUserList}/>
        </div>
    )
}
export default OnlineUserList;