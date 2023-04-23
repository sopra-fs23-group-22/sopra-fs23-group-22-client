import React from 'react'
import Square from './Square';
import '../../styles/ui/PieceSelector.scss'


const PieceSelector = () => {

    let pieceField = []
    for(let i=0; i<10; i++) {
        pieceField.push(<Square value={i}/>)
    }

  return (
    <div className='pieceSelector'>{pieceField}</div>
  );
}

export default PieceSelector;