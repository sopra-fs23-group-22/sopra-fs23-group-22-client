import React, {useEffect, useState} from "react";
import Frame from 'components/ui/Frame';
import 'styles/views/OngoingGame.scss';
import {api} from "../../helpers/api";
import { Spinner } from 'components/ui/Spinner';
// import Square from "components/ui/Square";
import 'styles/ui/Board.scss'
import SquareModel from "models/SquareModel";
// import Piece from "components/ui/Piece";
// import StrategoSocket from "components/socket/StrategoSocket";
import Board from "components/ui/Board";
import StrategoSocket from "components/socket/StrategoSocket";
import CustomPopUp from "components/ui/CustomPopUp";
import GameResult from "./GameResult";
import GameResultPopUp from "../ui/GameResultPopUp";
import { useParams } from "react-router-dom";


const OngoingGame = () => {

  const [board, setBoard] = useState([]);
  //const [showPopUp, setShowPopUp] = useState(false);
  const {roomId, playerId} = useParams();

  useEffect(() => {
    // console.log("running use effect");
    async function fetchData() {
      try {
        const response = await api.get(`/rooms/${localStorage.getItem("roomId")}/game`);
        console.log(response.data);
        // const response = await api.get('/boards');
        // console.log(board);
        // board = response.data;
        // board = response.data;
        setBoard(response.data);
        console.log(board);
      } catch(error) {
        alert("Something went wrong while fetching the game! See the console for details.")
      }
    }
    fetchData();
  }, []);


  const onMessage = (msg) => {
    // console.log(msg.player);
    // console.log("console log in OngoingGame.js");
    // targetBoard = msg;
    // setGameBoard(convertBoardDTOtoBoard(convertToSquares(msg)));

    // if the winnerId of msg is not -1, then the game is over --> we should pop up a window to show the winner
  }

  let content = <Spinner/>;
  if(board.length!==0 && board!==undefined) {
    // console.log("checking board")
    let convertedBoard = convertToSquares(board);
    // console.log(convertedBoard); // Check if convertedBoard is defined
    content = <Board targetBoard={convertedBoard} 
                     roomId={localStorage.getItem("roomId")}
                     playerId={localStorage.getItem("playerId")}/>
  }

  //let miscContent = <GameResult/>;
  let gameResultPopUp = <GameResultPopUp/>;

  return (
    <Frame>
      {/* <WebSocket/> */}
      <StrategoSocket
          topics = {`/ongoingGame/${roomId}`}
          onMessage={onMessage}
      />

      <div className='ongoingGame container'>
        {content}
      </div>
      <div className='gameResultPopUp container'>
        {gameResultPopUp}
      </div>
    </Frame>
  );
}

function convertToSquares(targetBoard) {
  // console.log(targetBoard); // Check if targetBoard is defined
  const squareList = [];
  for (let i = 0; i < targetBoard.length; i++) {
    let square = new SquareModel(
      targetBoard[i].axisX,
      targetBoard[i].axisY,
      targetBoard[i].type,
      targetBoard[i].content
    );
    squareList.push(square);
  }
  return squareList;
}


export default OngoingGame;