import "styles/ui/ProfileContainer.scss";
import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../../helpers/api";
import {Button} from "components/ui/elements/Button";
import StrategoSocket from "../../socket/StrategoSocket";

const ProfileContainer = () => {
  const history = useHistory();
  const {userId} = useParams();
  const [preUsername, setPreUsername] = useState("");
  const [username, setUsername] = useState("");
  const [saved, setSaved] = useState(false);
  const [wins, setWins] = useState(null);
  const [loss, setLoss] = useState(null);
  const roomId = localStorage.getItem("roomId");
  const onMessage = (msg) => {
    setUsername(msg.username);
    setLoss(msg.loss);
    setWins(msg.wins);
  }
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
  const returnRoom = async () => {
    try {
      const roomId = localStorage.getItem("roomId");
      history.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(
        `Something went wrong while return to lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
    }
  };
  const doEditUsername = async () => {
    try {
      const editUsername = {username: username.toString()};
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
  // FormField.propTypes = {
  //   label: PropTypes.string,
  //   defaultValue: PropTypes.string,
  //   value: PropTypes.string,
  //   onChange: PropTypes.func,
  // };
  return (
    <div className="profileContainer">
      <div className="profileContainer-title">PROFILE</div>
      <div className="profileContainer-content">
        <FormField disabled={true} label="ID" value={userId}/>
        <FormField
          label="USERNAME"
          value={username}
          onChange={(un) => unChange(un)}
          disabled={localStorage.getItem("id") !== userId}
        />
        <FormField disabled={true} label="WIN" value={wins}/>
        <FormField disabled={true} label="LOSS" value={loss}/>
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
              if (roomId !== null) {
                returnLobby();
              } else {
                returnRoom();
              }
            }}
          >
            RETURN
          </Button>
        )}
      </div>
      <StrategoSocket topics={`/users/${userId}`} onMessage={onMessage}/>
    </div>
  );
};
export default ProfileContainer;
