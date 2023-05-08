import React from 'react'
import '../../styles/ui/Piece.scss'
import bomb from '../images/piece/stratego-bomb.png'
import captain from '../images/piece/stratego-captain.png'
import colonel from '../images/piece/stratego-colonel.png'
import flag from '../images/piece/stratego-flag.png'
import general from '../images/piece/stratego-general.png'
import lieutenant from '../images/piece/stratego-lieutenant.png'
import major from '../images/piece/stratego-major.png'
import marshal from '../images/piece/stratego-marshal.png'
import miner from '../images/piece/stratego-miner.png'
import scout from '../images/piece/stratego-scout.png'
import sergeant from '../images/piece/stratego-sergeant.png'
import spy from '../images/piece/stratego-spy.png'

const Piece = ({ type, onClick, army, draggable, onDragStart}) => {

    if (!type) {
        return null;
    }

    let source = null;
    switch(type) {
        case "bomb":
            source = bomb;
            break;
        case "captain":
            source = captain;
            break;
        case "colonel":
            source = colonel;
            break;
        case "flag":
            source = flag;
            break;
        case "general":
            source = general;
            break;
        case "lieutenant":
            source = lieutenant;
            break;
        case "major":
            source = major;
            break;
        case "marshal":
            source = marshal;
            break;
        case "miner":
            source = miner;
            break;
        case "scout":
            source = scout;
            break;
        case "sergeant":
            source = sergeant;
            break;
        case "spy":
            source = spy;
            break;
        default:
            source = null;
    }

    // const imgSrc = `../images/piece/stratego-${type}.png`;


    let piece = null;
    if(army==="red") {
        piece = <div className='piece image-container-red'>
                    <img className = "piece icon" alt = {type} src={source} onClick={onClick} draggable="false"/>
                </div>
    } else {
        piece = <div className='piece image-container-blue'>
                    <img className = "piece icon" alt = {type} src={source} onClick={onClick} draggable="false"/>
                </div>
    }

    

    return (
        <div className="piece" draggable={draggable} onDragStart={onDragStart}>
            {piece}
        </div>
    );
}

export default Piece;