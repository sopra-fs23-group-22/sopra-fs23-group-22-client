import React from 'react'
import Frame from 'components/ui/Frame'
import Board from '../ui/Board'
import '../../styles/views/GamePreparing.scss'
// import Square from 'components/ui/Square'
// import PieceSelector from 'components/ui/PieceSelector'
// import Piece from 'components/ui/Piece'
import DefaultBoard from 'components/ui/DefaultBoard'


const GamePreparing = () => {

  return (
    <Frame>
        <div className='pregame container'>
            <div className='pregame board-container'>
                <DefaultBoard/>
            </div>
            {/* <div className='pregame piece-container'>
                <PieceSelector/>
            </div> */}
        </div>
    </Frame>
  )
}

export default GamePreparing