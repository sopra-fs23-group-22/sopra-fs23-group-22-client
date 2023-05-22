import GamePreparing from "components/views/GamePreparing";
import OngoingGame from "components/views/OngoingGame";
import Room from "components/views/Room";
import { Redirect, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

const RoomRouter = (props) => {
  const roomIdInStorage = localStorage.getItem("roomId");
  const roomState = localStorage.getItem("roomState");
  const playerIdInStorage = localStorage.getItem("id");
  const isWaiting = roomState === "WAITING";
  const isPreparing = roomState === "PREPARING";
  const isGameOn = roomState === "GAME_ON";
  const waitingSuffix = `/${roomIdInStorage}`;
  const preparingSuffix = `/${roomIdInStorage}/preparing/players/${playerIdInStorage}`;
  const gameOnSuffix = `/${roomIdInStorage}/game/players/${playerIdInStorage}`;

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
            // prevent players entering game preparing page from ongoing game page
            if (isGameOn) {
              return <Redirect to={props.base + gameOnSuffix} />;
            }
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
            // prevent players entering ongoing game page from room page
            if (isWaiting) {
              return <Redirect to={props.base + waitingSuffix} />;
            }
            // else if (isPreparing) {
            //   return <Redirect to={props.base + preparingSuffix} />;
            // }
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
            // prevent players entering ongoing game page from preparing page
            if (isPreparing) {
              return <Redirect to={props.base + preparingSuffix} />;
            }
            // prevent players entering ongoing game page from on going game page
            // else if (isGameOn) {
            //   return <Redirect to={props.base + gameOnSuffix} />;
            // }
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
