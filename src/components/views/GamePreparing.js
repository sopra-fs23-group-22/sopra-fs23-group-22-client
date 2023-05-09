import React, {useEffect} from 'react'
import '../../styles/views/GamePreparing.scss'
import Square from 'components/ui/Square'
import Piece from 'components/ui/Piece'
import { useState } from 'react';
import GamePiece from 'models/GamePiece'
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";
import {useHistory, useParams} from "react-router-dom";
import { Popup } from 'components/ui/PopUp';
import StrategoSocket from 'components/socket/StrategoSocket';
import PlayerList from "../ui/PlayerList";
import RulePopUp from 'components/ui/RulePopUp';
import CustomPopUp from 'components/ui/CustomPopUp';

const pieceTypes = [[null, null, "LAKE", "LAKE", null, null,"LAKE", "LAKE", null, null], 
                    ["marshal", "general", "colonel", "colonel", "major", "major", "major", "captain", "captain", "captain"], 
                    ["captain", "lieutenant", "lieutenant", "lieutenant", "lieutenant", "sergeant", "sergeant", "sergeant", "sergeant", "miner"], 
                    ["miner", "miner", "miner", "miner", "scout", "scout", "scout", "scout", "scout", "scout"],
                    ["scout", "scout", "spy", "bomb", "bomb","bomb","bomb","bomb","bomb", "flag"]]


const DefaultBoard = props => {

    const {army} = props;
    console.log(`army type: ${army}`);

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
      if(pieceType==="LAKE") {
        board.push(
            <Square
                key={`${i}-${j}`}
                value={i + j + 2}
                type={"LAKE"}
            />
        )
      } else {
        const piece = pieceType !== null ? 
            <Piece 
            type={pieceType} 
            army={army} 
            onClick={() => handlePieceClick(i, j)} 
            /> : null;
            board.push(
            <Square 
                key={`${i}-${j}`} 
                value={i + j + 2} 
                content={piece} 
            />);
    }
    }
  }
  
  return (
    <div className='pregame defaultBoard'>
        {board}
    </div>
  )
}



// const convertPieceTypeToPiece = ({pieceTypes}) => {
//   const gamePiece = new GamePiece(pieceTypes, "red");
//   return gamePiece;
// }



const GamePreparing = () => {

    const {roomId, playerId} = useParams();

    const [rightContent, setRightContent] = useState(<Spinner/>);
    const history = useHistory();
    let gameState = null;

    let armyType = null;

    const onMessage = (msg) => {
        gameState = msg;
        if(gameState==="IN_PROGRESS") {
            console.log("successful");
            history.push(`/rooms/${roomId}/game/players/${playerId}`);
        }
      }


    const doConfirm = async () => {
        try {
            console.log(pieceTypes.length);
            const board = [];
            for(let i=1; i<pieceTypes.length; i++) {
              for(let j=0; j<pieceTypes[i].length; j++) {
                const gamePiece = new GamePiece(pieceTypes[i][j], armyType);
                board.push(gamePiece);
              }
            }
            const requestBody = JSON.stringify(board);
            const response = await api.put(`/rooms/${roomId}/setBoard`, requestBody);
            console.log(response);
            if(response.data === "PRE_PLAY") {
                console.log("preparing")
                setRightContent(
                    <div>
                        <CustomPopUp open={true} information="Please wait for your opponent to set the Board.">
                            <Spinner/>
                        </CustomPopUp>
                    </div>
                )
            } else if (response.data === "IN_PROGRESS") {
                console.log("successful");
                history.push(`/rooms/${roomId}/game/players/${playerId}`);
            }
        } catch (error) {
            console.error(`Something went wrong while sending the board: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while sending the board! See the console for details.");
        }
    }

        useEffect(() => {
            async function fetchPlayers() {
                console.log("use effect fetch players")
                try {
                    const room = await api.get("/rooms/" + roomId);
                    const players = room.data.userIds;
                    console.log(`player 1: ${JSON.stringify(players[0])}`);

                    const currentPlayer = localStorage.getItem("id");
                    console.log(currentPlayer===JSON.stringify(players[0]));
                    console.log(`currentPlayer is ${currentPlayer}`);
                    if(currentPlayer===JSON.stringify(players[0])) {

                        console.log("enter here")
                        // red player
                        armyType = "red";
                        console.log("after setting color: "+armyType);
                    } else if(currentPlayer===JSON.stringify(players[1])){
                        console.log("also enter here")
                        armyType = "blue";
                        console.log("after setting color: "+armyType);
                    }
                    console.log("after setting color: "+armyType);
                    setRightContent(
                        <div className='pregame container'>
                            <div className='pregame board-container'>
                                <DefaultBoard army={armyType}/>
                            </div>
                            <div className='pregame confirm-button-container'>
                                <button className="pregame confirm-button" onClick={doConfirm}>Confirm</button>
                            </div>  
                        </div>)
                } catch (error) {
                    console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the players! See the console for details.");
                }
            }
            fetchPlayers();
        },[]);

      return (
            <div className="lobby row">
                <div className="lobby left">
                    <StrategoSocket
                        topics = {"/loading/"+roomId}
                        onMessage = {onMessage}
                    />
                    <div className="lobby left-search-user">
                        <div className="lobby left-search-input"/>
                    </div>

                    <div className="lobby left-down-side">
                        <div className="lobby online-users-container">
                            <div className="lobby online-users-title">
                                Players
                            </div>
                            <div className="lobby online-users-list">
                                <PlayerList/>
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
                    <div className='lobby right-info-container'>
                        <RulePopUp/>
                    </div>
                        <div className="lobby right-base-container">
                            {rightContent}
                        </div>
                    </div>
                </div>
            </div>
      )
}

export default GamePreparing;