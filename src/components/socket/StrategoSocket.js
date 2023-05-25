import SockJsClient from 'react-stomp';
import React from 'react'
import {getDomain} from 'helpers/getDomain';

const StrategoSocket = props => {

  return (
    <SockJsClient
      url={getDomain() + "/sopra-websocket"}
      topics={['/topic' + props.topics]}
      onMessage={msg => props.onMessage(msg)}
    />
  )
}

export default StrategoSocket;