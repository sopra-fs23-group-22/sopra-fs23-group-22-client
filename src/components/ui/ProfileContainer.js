import "styles/ui/ProfileContainer.scss";
import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";
const ProfileContainer = ()=> {
    const history = useHistory();
    const { userId } = useParams();
    const [preUsername, setPreUsername] = useState(null);
    const [username, setUsername] = useState(null);
    const [saved, setSaved] = useState(false);
    const [wins, setWins] = useState(null);
    const [loss, setLoss] = useState(null);

    // alert if the user did not save changes cannot work now:
    const returnLobby = async () => {
        try {
            if (
                saved === false &&
                localStorage.getItem("id") === userId &&
                preUsername !== username
            ) {
                alert("You did not save the changes!");
            }
            history.push("/lobby");
        } catch (error) {
            console.error(
                `Something went wrong while return to lobby: \n${handleError(error)}`
            );
            console.error("Details:", error);
        }
    };

    const doEditUsername = async () => {
        try {
            const editUsername = { username: username.toString() };
            const requestBody = JSON.stringify(editUsername);
            await api.put("/users/" + userId, requestBody);
            setSaved(true);
            alert("Save changes successfully!");
        } catch (error) {
            console.error(
                `Something went wrong while change username: \n${handleError(error)}`
            );
            console.error("Details:", error);
        }
    };

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
                console.error(
                    `Something went wrong while fetching the user: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert(
                    "Something went wrong while fetching the user! See the console for details."
                );
            }
        }

        fetchUser();
    }, []);

    const unChange = (un) => {
        if (localStorage.getItem("id") !== userId) {
            setUsername(username);
        } else {
            setUsername(un);
        }
    };

    const FormField = (props) => {
        return (
            <div className="field">
                <label className="field label">{props.label}</label>
                <input
                    className={
                        props.disabled ? "field disabled-input" : "field input"
                    }
                    placeholder={props.label}
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </div>
        );
    };
    FormField.propTypes = {
        label: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
    };
    return (
        <div className="container">
            <div className="title">
                Profile
            </div>
            <FormField
                disabled={true}
                label="id"
                value={userId}
                onChange={() => alert("You cannot change user id!")}
            />
            <FormField
                label="username"
                value={username}
                // onChange={u => {setUsername(u)}}
                onChange={unChange}
                disabled={localStorage.getItem("id") !== userId}
            />
            <div className="statistics">
                Statistics
            </div>
            <FormField
                disabled={true}
                label="wins"
                value={wins}
                onChange={() => alert("You cannot change user statistics!")}
            />
            <FormField
                disabled={true}
                label="loss"
                value={loss}
                onChange={() => alert("You cannot change user statistics!")}
            />
            <div className="buttonArea">
                {localStorage.getItem("id") === userId ? (
                    <button
                        className="button"
                        disabled={!username}
                        onClick={() => doEditUsername()}>
                        Save changes
                    </button>
                ) : (
                    <button
                        className="button"
                        onClick={() => returnLobby()}>
                        Return
                    </button>
                )}
            </div>
        </div>
    );
}
export default ProfileContainer;