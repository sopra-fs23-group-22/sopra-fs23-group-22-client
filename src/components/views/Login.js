import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
// import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (    
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};
const FormField2 = props => {
  return (
      <div className="login field">
        <label className="login label">
          {props.label}
        </label>
        <input
            type="password"
            className="login input"
            placeholder="enter here.."
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
        />
      </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {

  const history = useHistory();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doLogin = async () => {
    try {
      const login = {"status": "ONLINE"};
      const requestBody = JSON.stringify(login);

      const response = await api.get('/users/login/'+username)
      console.log('request to:', response.request.responseURL);

      if(response.data.password===password){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.id);
        const responseLogin = await api.put("/users/"+response.data.id, requestBody);
        console.log(responseLogin.request.responseURL);
          history.push('/game')
      } else {
        alert('Wrong password, please try agian')
      }

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doRegister = () => {
    history.push('/register')
  }


  return (
      // <Frame>
          <BaseContainer>
          <div className="login container">
            <div className="login form">
              <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
              />
              <FormField2
                label="Password"
                value={password}
                onChange={n => setPassword(n)}
              />
              <div className="login button-container">
                <Button
                  disabled={!username || !password}
                  width="100%"
                  onClick={() => doLogin()}
                >
                  Login
                </Button>
              </div>
              <div style={{marginTop: 10}}>
                  <a href='/register'
                    className='login link'
                    onClick={()=>doRegister}>
                    Create a new account
                  </a>
                </div>
            </div>
          </div>
        </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;