import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Frame from "components/ui/Frame";
import Header from "./Header";

const FormField = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        className="register input"
        placeholder="Please enter here"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
const FormField2 = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        type="password"
        className="register input"
        placeholder="Please enter here"
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
            <FormField2
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
