import {Route} from "react-router-dom";
import PropTypes from 'prop-types';
import GamePreparing from "components/views/GamePreparing";
import GameResult from "components/views/GameResult";
import OngoingGame from "components/views/OngoingGame";
const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <Route exact path="/rooms/:id/preparing/players/:playerId"><GamePreparing /></Route>
        <Route exact path="/rooms/:id/game/players/:playerId"><OngoingGame /></Route>
        <Route exact path="/rooms/:id/game/result"><GameResult/></Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
