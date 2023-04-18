import React from 'react'
import 'styles/ui/Tile.scss'

const Tile = (props) => {

    const {value, image} = props;

    if(value % 2 === 0) {
        return <div className='tile dark'>
                <img className = 'tile img' alt = "piece" src={image}/>
            </div>;
    } else {
        return <div className='tile light'>
                <img className = 'tile img' alt = "piece" src={image}/>
            </div>;
    }
    
}

export default Tile