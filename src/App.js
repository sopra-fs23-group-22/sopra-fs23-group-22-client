// import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
// import Frame from "components/ui/Frame"
// import WoodyBackground from "components/ui/WoodyBackground";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
import React, { useState } from 'react';
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/ws-message';

const App = () => {
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
            <div>{message}</div>
        </div>
    );
}



export default App;
