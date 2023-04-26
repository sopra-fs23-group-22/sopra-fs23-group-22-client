import SockJsClient from 'react-stomp';
import React, {useState} from 'react'

const Socket = () => {
    const SOCKET_URL = 'http://localhost:8080/ws-message';
    const [message, setMessage] = useState('You server message here.');

    let onConnected = () => {
        console.log("Connected!!")
    }

    let onMessageReceived = (msg) => {
        setMessage(msg.message);
    }

  return (
    <div>
        <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message']}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={msg => onMessageReceived(msg)}
        debug={false}
        />
        <div>
            {message};
        </div>
    </div>
  )
}

export default Socket;