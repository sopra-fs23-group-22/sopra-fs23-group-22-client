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


const convertPieceTypeToPiece = ({pieceTypes}) => {
  const gamePiece = new GamePiece(pieceTypes, "red");
  return gamePiece;
}

const confirmBoard = () => {
  console.log(pieceTypes.length);
  const board = [];
  for(let i=1; i<pieceTypes.length; i++) {
    for(let j=0; j<pieceTypes[i].length; j++) {
      const gamePiece = new GamePiece(pieceTypes[i][j], "red");
      board.push(gamePiece);
    }
  }
  console.log(board);
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
const GamePreparing = () => {
    const [myself, setMyself] = useState(null);
    const [opp, setOpp] = useState(null);
    const [playerIds, setPlayerIds] = useState([]);
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
    let listContent = <Spinner/>;

    if (myself && opp) {
        listContent = (
            <div className="lobby online-users-list">
                <Myself user={myself} key={myself.id}/>
                <Myself user={opp} key={opp.id}/>
                {/*<ul>*/}
                {/*    {opp.map(user => (*/}
                {/*        <Myself user={user} key={user.id}/>*/}
                {/*    ))}*/}
                {/*</ul>*/}
            </div>
        );
    }
      return (
          <div className="lobby row">
              <div className="lobby left">
                  <div className="lobby left-search-user">
                      <div className="lobby left-search-input"
                      />
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
                              Friends
                          </div>
                          <div className="lobby online-users-list">
                              Friend List
                          </div>
                      </div>
                  </div>
              </div>
              <div className="lobby right">
                  <div className="lobby right-header">
                      <div className="lobby right-logout-button" >
                          Logout
                      </div>
                  </div>
                  <div className="lobby right-main">
                      <div className="lobby right-base-container">
                          {/*<Frame>*/}
                          <div className='pregame container'>
                              <div className='pregame board-container'>
                                  <DefaultBoard/>
                              </div>
                              <div className='pregame confirm-button-container'>
                                  <button className="pregame confirm-button" onClick={confirmBoard}>Confirm</button>
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