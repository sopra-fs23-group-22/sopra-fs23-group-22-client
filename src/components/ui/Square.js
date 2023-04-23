import React from 'react'
import 'styles/ui/Square.scss'

const Square = (props) => {
    const {value, piece} = props;

    if(value % 2 === 0) {
        return <div className='square dark'>{piece}</div>;
            
    } else {
        return <div className='square light'>{piece}</div>;
    }

}

export default Square;