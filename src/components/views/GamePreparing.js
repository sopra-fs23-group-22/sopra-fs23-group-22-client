import React, {useEffect} from 'react'
import '../../styles/views/GamePreparing.scss'
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
import { Popup } from 'components/ui/PopUp';
import StrategoSocket from 'components/socket/StrategoSocket';

const pieceTypes = [[null, null, null, null, null, null, null, null, null, null], 
                    ["marshal", "general", "colonel", "colonel", "major", "major", "major", "captain", "captain", "captain"], 
                    ["captain", "lieutenant", "lieutenant", "lieutenant", "lieutenant", "sergeant", "sergeant", "sergeant", "sergeant", "miner"], 
                    ["miner", "miner", "miner", "miner", "scout", "scout", "scout", "scout", "scout", "scout"],
                    ["scout", "scout", "spy", "bomb", "bomb","bomb","bomb","bomb","bomb", "flag"]]


const DefaultBoard = () => {

  const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);
  let positionToBeSwapped = null;
  // store temporary position
  let temp = null;

  const handlePieceClick = (row, col) => {
    // if the first position is not selected yet
    if (selectedPiecePosition===null) {
      // assign the position to the variable
      setSelectedPiecePosition([row,col]);
    } else {
      // store the position of the other selected piece
      positionToBeSwapped = [row, col];
      // store the type of the other selected piece
      temp = pieceTypes[positionToBeSwapped[0]][positionToBeSwapped[1]];
      // swap the two piece
      pieceTypes[positionToBeSwapped[0]][positionToBeSwapped[1]] = pieceTypes[selectedPiecePosition[0]][selectedPiecePosition[1]];
      pieceTypes[selectedPiecePosition[0]][selectedPiecePosition[1]] = temp;
      // set the first posistion to be null again
      setSelectedPiecePosition(null);
    }
  };

  const board = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
      const pieceType = pieceTypes[i][j];
      const piece = pieceType !== null ? <Piece type={pieceType} army="red" onClick={() => handlePieceClick(i, j)} /> : null;
      board.push(<Square key={`${i}-${j}`} value={i + j + 2} content={piece} />);
    }
  }
  
  return (
    <div className='pregame defaultBoard'>{board}</div>
  )
}


async function Loadding() {
    console.log("start use effect");
    console.log("start fetching from backend");
    // const history = useHistory();
    let count = 0;
    console.log("before fetching");
    let gameBoard;

    console.log("start fetching")
    try {
        const roomId = localStorage.getItem('roomId');
        // const currentGameId = localStorage.getItem('currentGameId');
        console.log(roomId);
        // console.log(currentGameId);
        const response = await api.get(`/boards`);
        gameBoard = response.data;
        console.log (gameBoard);
        console.log("fetch is good");

        for (let i = 0; i < gameBoard.length; i++) {
            if(gameBoard[i].content !== null) {
                count ++;
            }
            console.log(count);
          if(count !== 80) {
            rightContent = (
                <div>
                  <Popup id="loading-popup">
                    Please wait for your opponent to set the Board.
                  </Popup>
                  <Spinner/>
                </div>
              );
          } else {
            // history.push('/ongoingGame');
            console.log("successful");
          }
        }
    } catch (error) {
        console.error(`Something went wrong while fetching the opponent: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the opponent! See the console for details.");
    }
}




const convertPieceTypeToPiece = ({pieceTypes}) => {
  const gamePiece = new GamePiece(pieceTypes, "red");
  return gamePiece;
}


const Myself = ({user}) => (
    <div>
        <div className="lobby user-myself-username">{user.username}</div>
        <div className="lobby user-myself-edit"> Edit </div>
    </div>
);
Myself.propTypes = {
    user: PropTypes.object
};

let rightContent = <DefaultBoard/>;


const GamePreparing = () => {
    const history = useHistory();
    const [myself, setMyself] = useState(null);
    const [opp, setOpp] = useState(null);
    const [playerIds, setPlayerIds] = useState([]);

    const onMessage = (msg) => {
        console.log(msg);
        // targetBoard = msg;
        // setGameBoard(convertBoardDTOtoBoard(convertToSquares(msg)));
      }


    const doLogout = async () => {
        try {
            const logout = {"status": "OFFLINE"};
            const requestBody = JSON.stringify(logout);

            const userId = localStorage.getItem('id');
            const response = await api.put("/users/" + userId, requestBody);
            localStorage.removeItem('token');
            history.push('/login');
        } catch (error) {
            console.error(`Something went wrong while logout: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while logout! See the console for details.");
        }

    }
    const doConfirm = async () => {
        try {

            console.log(pieceTypes.length);
            const board = [];
            for(let i=1; i<pieceTypes.length; i++) {
              for(let j=0; j<pieceTypes[i].length; j++) {
                const gamePiece = new GamePiece(pieceTypes[i][j].toUpperCase(), "BLUE");
                board.push(gamePiece);
              }
            }
            const requestBody = JSON.stringify(board);
            // const response = await api.put(`/rooms/${localStorage.getItem('roomId')}/setBoard`);
            const response = await api.put(`/rooms/1/setBoard`, requestBody);
            console.log(requestBody);
            console.log("response:" +response.request.responseURL);
            // console.log(response.data);
            // console.log(board);
            Loadding();
        } catch (error) {
            console.error(`Something went wrong while sending the board: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while sending the board! See the console for details.");
        }
    }
    // const doConfirm = async () => {
    //     const requestBody = JSON.stringify(confirm);
    //     await api.put(`users/${localStorage.getItem('id')}/comfirm`, requestBody);
    // }

    // const receiveConfirm = (board) => {
    //     if (board.) {
    //         setGameResult("VICTORY");
    //     } else {
    //         setGameResult("DEFEAT");
    //     }

    // }
    



    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside
        async function fetchMyself() {
            console.log("use effect fetch myself")
            try {
                const userId = localStorage.getItem('id');
                const response = await api.get("/users/" + userId);
                setMyself(response.data);
                console.log(myself);

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
        async function fetchPlayers() {
            console.log("use effect fetch players")
            try {
                const roomId = localStorage.getItem('roomId');
                const room = await api.get("/rooms/" + roomId);
                console.log(`player ids are: ${JSON.stringify(room.data.userIds)}`);
                console.log(`data type: ${typeof(JSON.stringify(room.data.userIds))}`);
                setPlayerIds(JSON.stringify(room.data.userIds));

            } catch (error) {
                console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the players! See the console for details.");
            }
        }
        fetchPlayers();
    },[]);
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchOpp() {
            try {
                console.log("use effect fetch opp");
                const userId = localStorage.getItem('id');
                console.log(typeof(userId));
                console.log(typeof(playerIds[0]));
                const oppId = playerIds.filter(player => player !== userId);
                console.log(oppId);
                const response = await api.get("/users/" + oppId);
                console.log(response.data);
                setOpp(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the opponent: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the opponent! See the console for details.");
            }
        }
        fetchOpp();
    },[playerIds]); // when playerIds updated, fetch opponent

    let listContent1 = <Spinner/>;
    let listContent2 = <Spinner/>;
    if (myself) {
        listContent1 = (
            <Myself user={myself} key={myself.id}/>
        );
    }
    if (opp) {
        listContent2 = (
            <Myself user={opp} key={opp.id}/>
        );
    }
      return (
            <div className="lobby row">
                
                <div className="lobby left">
                    <StrategoSocket
                        topics = "/loading"
                        onMessage = {onMessage}
                    />
                    <div className="lobby left-search-user">
                        <div className="lobby left-search-input"
                        />
                    </div>

                    <div className="lobby left-down-side">
                        <div className="lobby online-users-container">
                            <div className="lobby online-users-title">
                                Players
                            </div>
                            <div className="lobby online-users-list">
                                {listContent1}
                                {listContent2}
                            </div>
                        </div>
                        <div className="lobby online-users-container">
                            <div className="lobby online-users-title">
                                Chat
                            </div>
                            <div className="lobby online-users-list">
                                Chat function
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lobby right">
                    <div className="lobby right-header">

                    </div>
                    <div className="lobby right-main">
                        <div className="lobby right-base-container">
                            {/*<Frame>*/}
                            <div className='pregame container'>
                                <div className='pregame board-container'>
                                    {rightContent}
                                </div>
                                <div className='pregame confirm-button-container'>
                                    <button className="pregame confirm-button" onClick={doConfirm}>Confirm</button>
                                </div>  
                            </div>
                            
                            {/*</Frame>*/}
                        </div>
                    </div>
                </div>
            </div>
      )
}

export default GamePreparing;