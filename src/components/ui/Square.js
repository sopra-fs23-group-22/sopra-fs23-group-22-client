import React from 'react'
import 'styles/ui/Square.scss'

const Square = (props) => {
    const {value, content, type} = props;

    // if(value % 2 === 0) {
    //     return <div className='square dark'>{content}</div>;
    // } else {
    //     return <div className='square light'>{content}</div>;
    // }


    if(type==="LAKE") {
        return <div className='square lake'></div>
    } else {
        if(value % 2 === 0) {
            return <div className='square dark'>{content}</div>;
        } else {
            return <div className='square light'>{content}</div>;
        }
    }



}

export default Square;