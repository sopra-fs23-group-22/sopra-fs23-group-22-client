import React from 'react'
import '../../styles/ui/Piece.scss'

const Piece = ({ type, onClick}) => {

    if (!type) {
        return null;
    }

    const imgSrc = `images/pieces/stratego-${type}.svg`;

    return (
        // <div className="piece" draggable="true" onDragStart={onDragStart}>
        <div className="piece">
            <div className='piece image-container'>
                <img className = "piece icon" alt = {type} src={imgSrc} onClick={onClick}/>
            </div>
        </div>
    );
}

export default Piece;