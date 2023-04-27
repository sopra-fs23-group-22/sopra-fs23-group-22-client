import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Spinner} from "./Spinner";
import StrategoSocket from "../socket/StrategoSocket";
import {api, handleError} from "../../helpers/api";

const OnlineUserList = props => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const onlineUserList = (msg) => {
        setOnlineUsers(msg.filter(m =>m.id != localStorage.getItem('id')));
    }
    const OnlineUsers = ({user}) => (
        <div>
            <div className="lobby user-myself-username">{user.username}</div>
            <div className="lobby user-myself-edit"> Chat </div>
        </div>
    );

    OnlineUsers.propTypes = {
        user: PropTypes.object
    };
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchOnlineUsers() {
            try {
                const response = await api.get('/users/online');
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
                    <OnlineUsers user={user} key={user.id}/>
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