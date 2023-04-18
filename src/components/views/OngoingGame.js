import Board from 'components/ui/Board';
import React, {useEffect, useState} from "react";
import Frame from 'components/ui/Frame';
import 'styles/views/OngoingGame.scss';
import {api} from "../../helpers/api";

const OngoingGame = ({Game}) => {

  const [game, setGame] = useState(null);

  useEffect(() => {
    
    async function fetchData() {
      try {
        const response = await api.get('/game/'+game.id)
        setGame(response.data)
      } catch(error) {
        alert("Something went wrong while fetching the game! See the console for details.")
      }
    }

    fetchData();
  }, []);


  return (
    <Frame>
      <div className='ongoingGame container'>
          <Board/>
      </div>
    </Frame>
  )
}

export default OngoingGame