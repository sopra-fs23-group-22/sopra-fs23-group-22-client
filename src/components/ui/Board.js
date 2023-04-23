import React from 'react';
import 'styles/ui/Board.scss';
import Square from './Square';
// import {api, handleError} from 'helpers/api';
import { useState } from 'react';
// import { useEffect } from 'react';


const verticalAxis = ["1","2","3","4","5","6","7","8","9","10"]
const horizontalAxis = ["A","B","C","D","E","F","G","H","I","J"]


const Board = (props) => {

    const {size} = props;

    let board = [];
    if(size === "full"){
        for(let j=10; j>=0; j--) {
            for(let i=0; i<horizontalAxis.length; i++) {
                let number = i+j+2;
                board.push(<Square value={number}/>)
            }
        }
    } else if(size==="half") {
        for(let i=0; i<5; i++) {
            for(let j=0; j<10; j++) {
                let number = i+j+2;
                board.push(<Square value={number}/>)
            }
        }
    }


    return (
    <div className='board'>{board}</div>
    );   
};

export default Board;