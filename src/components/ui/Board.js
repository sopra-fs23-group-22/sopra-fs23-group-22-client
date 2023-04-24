// import React from 'react';
// import 'styles/ui/Board.scss';
// import Square from './Square';
// // import {api, handleError} from 'helpers/api';
// import { useState } from 'react';
// import Piece from './Piece';
// // import { useEffect } from 'react';


// const verticalAxis = ["1","2","3","4","5","6","7","8","9","10"]
// const horizontalAxis = ["A","B","C","D","E","F","G","H","I","J"]


// const Board = ({board}) => {
//     let gameBoard = [];

//     if(board.length > 0 ) {

//         for(let j=0; j<=10; j++) {
//             for(let i=0; i<10; i++) {
//                 const pieceType = board[i][j].content.pieceType;
//                 const piece = pieceType !== null? <Piece type={pieceType}/> : null;
//                 board.push(<Square key={`${i}-${j}`} value={i + j + 2} piece={piece} />);
//                 // let number = i+j+2;
//                 // let squareId = (i+1) + j*10;
//                 // gameBoard.push(<Square key={squareId} value={number}/>)
//             }
//         }

//     }       
//     return (
//     <div className='board'>{gameBoard}</div>
//     );   
// };

// export default Board;