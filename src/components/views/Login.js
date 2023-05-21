import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Frame from "components/ui/Frame";
import Header from "./Header";
import { FormField } from "components/ui/FormField";

const Login = (props) => {
  const history = useHistory();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doLogin = async () => {
    try {
      const login = { status: "ONLINE" };
      const requestBody = JSON.stringify(login);

      const response = await api.get("/users/" + username + "/login");
      console.log("request to:", response.request.responseURL);

      if (response.data.password === password) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.id);
        const responseLogin = await api.put(
          "/users/" + response.data.id,
          requestBody
        );
        console.log(responseLogin.request.responseURL);
        history.push("/lobby");
      } else {
        alert("Wrong password, please try agian");
      }
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doRegister = () => {
    history.push("/register");
  };

  return (
    <Frame>
      <BaseContainer>
        <Header />
        <div className="login container">
          <div className="login form">
            <FormField
              label="Username"
              value={username}
              onChange={(un) => setUsername(un)}
            />
            <FormField
              type="password"
              label="Password"
              value={password}
              onChange={(n) => setPassword(n)}
            />
            <div className="login button-container">
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doLogin()}
              >
                LOGIN
              </Button>
            </div>
            <div style={{ marginTop: 10 }}>
              <a
                href="/register"
                className="login link"
                onClick={() => doRegister}
              >
                CREATE NEW ACCOUNT
              </a>
            </div>
          </div>
        </div>
      </BaseContainer>
    </Frame>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
