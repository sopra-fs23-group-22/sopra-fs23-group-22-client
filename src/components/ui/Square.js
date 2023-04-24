import React from 'react'
import 'styles/ui/Square.scss'

const Square = ({value, content, type, onDragOver, onDrop}) => {

    // if(value % 2 === 0) {
    //     return <div className='square dark'>{content}</div>;
    // } else {
    //     return <div className='square light'>{content}</div>;
    // }


    if(type==="LAKE") {
        return <div className='square lake'></div>
    } else {
        if(value % 2 === 0) {
            return <div className='square dark' onDragOver={onDragOver} onDrop={onDrop}>{content}</div>;
        } else {
            return <div className='square light' onDragOver={onDragOver} onDrop={onDrop}>{content}</div>;
        }
    }



}

export default Square;