import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import Frame from "components/ui/Frame";
import Header from "./Header";
import { FormField } from "components/ui/FormField";

const Register = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", response.headers.token);
      localStorage.setItem("id", user.id);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/lobby`);
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };

  return (
    <Frame>
      <BaseContainer>
        <Header />
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
