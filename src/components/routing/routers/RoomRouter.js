import GamePreparing from "components/views/GamePreparing";
import OngoingGame from "components/views/OngoingGame";
import Room from "components/views/Room";
import { Redirect, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

const RoomRouter = (props) => {
  const roomIdInStorage = localStorage.getItem("roomId");

  return (
    <Switch>
      <Route
        path={`${props.base}/:roomId/preparing/players/:playerId`}
        render={({ match }) => {
          const roomId = match.params.roomId;
          if (!roomIdInStorage) {
            return <Redirect to="/lobby" />;
          }
          if (roomId === roomIdInStorage) {
            return <GamePreparing />;
          } else {
            return <Redirect to={`${props.base}/${roomIdInStorage}`} />;
          }
        }}
      ></Route>
      <Route
        path={`${props.base}/:roomId/game/players/:playerId`}
        render={({ match }) => {
          const roomId = match.params.roomId;
          if (!roomIdInStorage) {
            return <Redirect to="/lobby" />;
          }
          if (roomId === roomIdInStorage) {
            return <OngoingGame />;
          } else {
            return <Redirect to={`${props.base}/${roomIdInStorage}`} />;
          }
        }}
      ></Route>
      <Route
        path={`${props.base}/:roomId`}
        render={({ match }) => {
          const roomId = match.params.roomId;
          console.log(roomId);
          if (!roomIdInStorage) {
            return <Redirect to="/lobby" />;
          }
          if (roomId === roomIdInStorage) {
            return <Room />;
          } else {
            return <Redirect to={`${props.base}/${roomIdInStorage}`} />;
          }
        }}
      ></Route>
    </Switch>
  );
};

RoomRouter.propTypes = {
  base: PropTypes.string.isRequired,
};

export default RoomRouter;
