import React from 'react'
import '../../styles/ui/Piece.scss'

const Piece = ({ type, onClick, army, draggable, onDragStart}) => {

    if (!type) {
        return null;
    }

    const imgSrc = `images/pieces/stratego-${type}.svg`;

    let piece = null;
    if(army==="red") {
        piece = <div className='piece image-container-red'>
                    <img className = "piece icon" alt = {type} src={imgSrc} onClick={onClick} draggable="false"/>
                </div>
    } else {
        piece = <div className='piece image-container-blue'>
                    <img className = "piece icon" alt = {type} src={imgSrc} onClick={onClick} draggable="false"/>
                </div>
    }


    return (
        // <div className="piece" draggable="true" onDragStart={onDragStart}>
        <div className="piece" draggable={draggable} onDragStart={onDragStart}>
            {piece}
        </div>
    );
}

export default Piece;