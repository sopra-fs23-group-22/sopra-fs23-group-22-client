import SockJsClient from 'react-stomp';
import React from 'react'
import { getDomain } from 'helpers/getDomain';

const StrategoSocket = props => {

    // var socket = new SockJS("/topics/boards");

    const SOCKET_URL = 'http://localhost:8080/ws-message';
    // const [message, setMessage] = useState('You server message here.');

    // let onConnected = () => {
    //     console.log("Connected!!")
    // }

    // let onMessageReceived = (msg) => {
    //     setMessage(msg.message);
    // }

  return (
        <SockJsClient
        url={getDomain()+"/ws-message"}
        topics={['/topic'+props.topics]}
        // onConnect={onConnected}
        // onDisconnect={console.log("Disconnected!")}
        onMessage={msg => props.onMessage(msg)}
        // debug={false}
        />
  )
}

export default StrategoSocket;