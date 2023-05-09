import React, {useEffect} from 'react'
import '../../styles/views/GameResult.scss'
import Square from 'components/ui/Square'
// import PieceSelector from 'components/ui/PieceSelector'
import Piece from 'components/ui/Piece'
import { useState } from 'react';
import GamePiece from 'models/GamePiece'
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";
import user from "../../models/User";
import {useHistory, useParams} from "react-router-dom";
import { Button } from 'components/ui/Button';
import CustomPopUp from 'components/ui/CustomPopUp';
import StrategoSocket from "../socket/StrategoSocket";

const GameResultPopUp = () => {

  const roomId = localStorage.getItem("roomId");
  const history = useHistory();
  const [playerIds, setPlayerIds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const token = localStorage.getItem("token");
  const playerId = parseInt(localStorage.getItem("playerId"));
  const [showOpenGameResultPopup, setGameResultPopUp] = useState(false);

  const playAgain = () => {
    // ... more operations
    history.push(`/room`)
  }

  const goLobby = () => {
    // ... more operations
    const requestBody = JSON.stringify(user)
    api.delete(`/rooms/${localStorage.getItem('id')}/user`, requestBody);
    localStorage.removeItem('users');
    history.push('/lobby');
  }

  let listContent = <Spinner/>;

  let onMessage = (msg) => {
    if (msg.winnerId !== -1) {
      if (JSON.stringify(msg.winnerId) === localStorage.getItem("id")) {
        setGameResult("VICTORY");
        setGameResultPopUp(true);
      } else {
        setGameResult("DEFEAT");
        setGameResultPopUp(true);
      }
      //show the name of the winner
      setWinner(players.username);
    }
  };


  return (
        <CustomPopUp open={showOpenGameResultPopup} information="">
          <label className={gameResult === "VICTORY" ? "winnerWindow" : "loserWindow"}>{gameResult}</label>
          {
            winner ? <label>{winner} won the game</label> : null
          }
          <Button className="lobby base-container-button"
                  onClick={() =>
                    playAgain()
                  }>
            PLAY AGAIN
          </Button>
          <Button className="lobby base-container-button"
                  onClick={() =>
                    goLobby()
                  }>
            LOBBY
          </Button>
          <StrategoSocket
            topics = {`/ongoingGame/${roomId}`}
            onMessage = {onMessage}
          />
        </CustomPopUp>
  )
}

export default GameResultPopUp;