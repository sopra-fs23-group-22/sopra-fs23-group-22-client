import "styles/ui/ProfileContainer.scss";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
const ProfileContainer = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [preUsername, setPreUsername] = useState(null);
  const [username, setUsername] = useState(null);
  const [saved, setSaved] = useState(false);
  const [wins, setWins] = useState(null);
  const [loss, setLoss] = useState(null);
  const roomId = localStorage.getItem('roomId');
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
  const returnRoom = async() => {
    try {
      const roomId = localStorage.getItem("roomId");
      history.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
    }
  }
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
      }
    }

    fetchUser();
  }, [userId]);

  const unChange = (un) => {
    if (localStorage.getItem("id") !== userId) {
      setUsername(username);
    } else {
      setUsername(un);
    }
  };

  const FormField = (props) => {
    const content = props.disabled ? (
      <label className="profileContainer-field disabled-input">
        {props.value}
      </label>
    ) : (
      <input
        className={
          props.disabled
            ? "profileContainer-field disabled-input"
            : "profileContainer-field input"
        }
        value={props.value}
        placeholder={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    );
    return (
      <div className="profileContainer-field">
        <label className="profileContainer-field label">{props.label}</label>
        {content}
      </div>
    );
  };
  FormField.propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  return (
    <div className="profileContainer">
      <div className="profileContainer-title">Profile</div>
      <div className="profileContainer-content">
        <FormField
          disabled={true}
          label="id"
          value={userId}
        />
        <FormField
          label="username"
          value={username}
          onChange={(un) => unChange(un)}
          disabled={localStorage.getItem("id") !== userId}
        />
        <FormField
          disabled={true}
          label="wins"
          value={wins}
        />
        <FormField
          disabled={true}
          label="loss"
          value={loss}
        />
      </div>
      <div className="profileContainer-buttonArea">
        {localStorage.getItem("id") === userId ? (
          <Button
            disabled={!username || username === preUsername}
            onClick={() => doEditUsername()}
          >
            SAVE CHANGES
          </Button>
        ) : (
          <Button
            onClick={() => {
              if(roomId !== null) {returnLobby()} else {returnRoom()}
            }}
          >
            RETURN
          </Button>
        )}
      </div>
    </div>
  );
};
export default ProfileContainer;
