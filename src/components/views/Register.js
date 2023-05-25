import React, {useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useHistory} from "react-router-dom";
import {Button} from "components/ui/elements/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/containers/BaseContainer";
import Frame from "components/ui/elements/Frame";
import Header from "./Header";
import {FormField} from "components/ui/elements/FormField";

const Register = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", response.headers.token);
      localStorage.setItem("id", user.id);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/lobby`);
    } catch (error) {
      alert(error.response.data.message);
      console.log(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  return (
    <Frame>
      <BaseContainer>
        <Header/>
        <div className="register container">
          <div className="register form">
            <FormField
              label="username"
              value={username}
              onChange={(un) => setUsername(un)}
            />
            <FormField
              type="password"
              label="password"
              value={password}
              onChange={(p) => setPassword(p)}
            />
            <div className="register button-container">
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doRegister()}
              >
                Register
              </Button>
              <Button width="100%" onClick={() => history.push(`/login`)}>
                Back to log in
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
    </Frame>
  );
};

export default Register;
