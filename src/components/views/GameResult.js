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

const Myself = ({user}) => (
    <div>
        <div className="lobby user-myself-username">{user.username}</div>
        <div className="lobby user-myself-edit"> Edit </div>
    </div>
);
Myself.propTypes = {
    user: PropTypes.object
};

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

    // const doLogout = async () => {
    //     try {
    //         const logout = {"status": "OFFLINE"};
    //         const requestBody = JSON.stringify(logout);

    //         const userId = localStorage.getItem('id');
    //         const response = await api.put("/users/" + userId, requestBody);
    //         localStorage.removeItem('token');
    //         history.push('/login');
    //     } catch (error) {
    //         console.error(`Something went wrong while logout: \n${handleError(error)}`);
    //         console.error("Details:", error);
    //         alert("Something went wrong while logout! See the console for details.");
    //     }

    // }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchMyself() {
            try {
                const userId = localStorage.getItem('id');
                const response = await api.get("/users/" + userId);
                setMyself(response.data);
                console.log(Myself);

            } catch (error) {
                console.error(`Something went wrong while fetching the myself: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the myself! See the console for details.");
            }
        }
        fetchMyself();
    },[]);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchOpp() {
            try {
                const roomId = localStorage.getItem('roomId');
                const userId = localStorage.getItem('id');
                console.log(roomId);
                console.log(userId);
                const room = await api.get("/rooms/" + roomId);
                setPlayerIds(room.data.userIds);
                setPlayers(room.data.users)
                console.log(playerIds)
                const oppId = playerIds.filter(player => player !== userId)

                const response = await api.get("/users/" + oppId);
                setOpp(response.data[0]);

            } catch (error) {
                console.error(`Something went wrong while fetching the opponent: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the opponent! See the console for details.");
            }
        }
        fetchOpp();
    },[]);

    const gameOver = (gameOverInfo) => {
        console.log(gameOverInfo)
        // if (gameOverInfo.winners.length === 0) {
        //     setGameResult("DRAW");
        // }
        if (gameOverInfo.winners[0] === parseInt(playerIds)) {
            setGameResult("VICTORY");
        } else {
            setGameResult("DEFEAT");
        }
        //show the name of the winner
        setWinner(players.username);
        setEndGame(true);
    }

    const confirmResign = async () => {
        const requestBody = JSON.stringify(resign);
        await api.put(`users/${localStorage.getItem('id')}/resign`, requestBody);
    }

    const receiveResign = (resignInfo) => {
        setEndGame(true);
        let loser = resignInfo.resignedPlayer;
        let result = loser === playerId ? "DEFEAT" : "VICTORY";
        let winner = players.find(id => id !== loser);
        setGameResult(result);
        setWinner(winner.username);
    }

    const playAgain = () => {
        history.push(`/room`)
        //清除上一轮棋盘数据？
    }

    const goLobby = () => {
        const requestBody = JSON.stringify
        api.delete(`/rooms/${localStorage.getItem('id')}/players`, requestBody);
        localStorage.removeItem('playerId');
        history.push('/lobby');
    }

    let listContent = <Spinner/>;
    
    
    if (myself && opp) {
        listContent = (
            <div className="lobby online-users-list">
                <Myself user={myself} key={myself.id}/>
                <Myself user={opp} key={opp.id}/>
            </div>
        );
    }

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
                                <button className="gameResult confirm-button" onClick={confirmResign}>
                                    Resign
                                </button>
                            </div>
                        </div>
                          
                          {/*</Frame>*/}
                      </div>
                </div>

                    <CustomPopUp open={resign} information={"Do you really want to resign?"}>
                        <Button className="pregame confirm-button" onClick={() => confirmResign()}>
                            RESIGN
                        </Button>
                        <Button className="pregame confirm-button" onClick={() => setResign(false)}>
                        CONTINUE
                        </Button>                    
                    </CustomPopUp>
                    <CustomPopUp open={endGame} information="">
                    <label className={gameResult === "VICTORY" ? "winnerWindow" : "loserWindow"}>{gameResult}</label>
                    {
                        winner ? <label>{winner} won the game</label> : null
                    }
                    <Button className="pregame confirm-button"
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