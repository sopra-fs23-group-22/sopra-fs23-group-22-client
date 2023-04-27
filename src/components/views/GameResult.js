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
import {useHistory} from "react-router-dom";
import { Button } from 'components/ui/Button';
import CustomPopUp from 'components/ui/CustomPopUp';

const GameResult = () => {

    const history = useHistory();
    const [myself, setMyself] = useState(null);
    const [opp, setOpp] = useState(null);
    const [playerIds, setPlayerIds] = useState([]);
    const [players, setPlayers] = useState([]);
    const [resign, setResign] = useState(false);
    const [endGame, setEndGame] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [winner, setWinner] = useState(null);
    const token = localStorage.getItem("token");
    const [openPopup, setOpenPopup] = useState(false);
    const playerId = parseInt(localStorage.getItem("playerId"));
    // const [gameData, setGameData] = useState({
    //     players: {},

    // });

    const handleResign = () => {
        setResign(true);
      };

    const gameOver = (gameInfo) => {
        console.log(gameInfo)
        if (gameInfo.winner === parseInt(playerIds)) {
            setGameResult("VICTORY");
        } else {
            setGameResult("DEFEAT");
        }
        //show the name of the winner
        setWinner(players.username);
        setEndGame(true);
    }

    const doResign = async () => {
        setEndGame(true);
        const userId = localStorage.getItem('id');
        const requestBody = JSON.stringify(resign);
        const response = await api.put(`users/${localStorage.getItem('id')}/resign`, requestBody);
        let loser = response.resignedPlayer;
        let result = loser.userId === userId ? "DEFEAT" : "VICTORY";
        let winner = players.find(userId => userId !== loser);
        setGameResult(result);
        setWinner(winner.username);
    }


    const playAgain = () => {
        history.push(`/room`)
        //清除上一轮棋盘数据？
    }

    const goLobby = () => {
        const requestBody = JSON.stringify(user)
        api.delete(`/rooms/${localStorage.getItem('id')}/user`, requestBody);
        localStorage.removeItem('users');
        history.push('/lobby');
    }

    let listContent = <Spinner/>;
    

      return (
          <div className="lobby row">
              <div className="lobby left">
                  <div className="lobby left-search-user">
                      <div className="lobby left-search-input"/>
                  </div>
                  <div className="lobby left-down-side">
                      <div className="lobby online-users-container">
                          <div className="lobby online-users-title">
                              Players
                          </div>
                          {listContent}
                      </div>
                      <div className="lobby online-users-container">
                          <div className="lobby online-users-title">
                              Chatbox
                          </div>
                          <div className="lobby online-users-list">
                              {/* Friend List */}
                          </div>
                      </div>
                  </div>
              </div>
            <div className="lobby right">
                <div className="lobby right-header">
                    {/* <div className="lobby right-logout-button" onClick={() => doLogout()} >
                        Logout
                    </div> */}
                </div>


                <div className="lobby right-main">
                      <div className="lobby right-base-container">
                          {/*<Frame>*/}
                        <div className='pregame container'>
                            <div className='pregame board-container'></div>
                            <div className='gameResult confirm-button-container'>
                                <button className="gameResult confirm-button" onClick={handleResign}>
                                    Resign
                                </button>
                            </div>
                        </div>
                          
                          {/*</Frame>*/}
                      </div>
                </div>

                    <CustomPopUp open={resign} information={"Do you really want to resign?"}>
                        <Button className="lobby base-container-button" onClick={() => doResign()}>
                            Resign
                        </Button>
                        <Button className="lobby base-container-button" onClick={() => setResign(false)}>
                        Continue
                        </Button>                    
                    </CustomPopUp>
                    <CustomPopUp open={endGame} information="">
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
                    </CustomPopUp>
                </div>
          </div>
      )
}

export default GameResult;