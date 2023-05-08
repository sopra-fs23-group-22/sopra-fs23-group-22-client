import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "./Spinner";
import {useHistory} from "react-router-dom";

const Myself = props => {
    const history = useHistory();
    const [myself, setMyself] = useState(null);
    const Myself = ({user}) => (
        <div>
            <div className="lobby user-myself-username"onClick={() => profile(user.id)}>{user.username}</div>
            <div className="lobby user-myself-edit"onClick={() => profile(user.id)}> Edit </div>
        </div>
    );
    const profile = (userId) => {
        history.push(`/users/profile/${userId}`);
    }
    Myself.propTypes = {
        user: PropTypes.object
    };
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchMyself() {
            try {
                const userId = localStorage.getItem('id');
                const response = await api.get("/users/" + userId);
                setMyself(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchMyself();

    }, []);
    let listContent1 = <Spinner/>;
    if (myself) {
        listContent1 = (
            <Myself user={myself} key={myself.id}/>
        );
    }
    return(
        <div>
            {listContent1}
        </div>
    )
}
export default Myself;