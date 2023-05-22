import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const RoomGuard = (props) => {
  const roomState = localStorage.getItem("roomState");
  const roomId = localStorage.getItem("roomId");
  const playerId = localStorage.getItem("id");
  console.log(roomState);
  if ((roomId && !roomState) || roomState === "WAITING") {
    console.log("WAITING");
    return <Redirect to={`/rooms/${roomId}`} />;
  } else if (roomState === "PREPARING") {
    console.log("PREPARING");
    return <Redirect to={`/rooms/${roomId}/preparing/players/${playerId}`} />;
  } else if (roomState === "GAME ON") {
    console.log("GAME_ON");
    return <Redirect to={`/rooms/${roomId}/game/players/${playerId}`} />;
  } else {
    return props.children;
  }
};

RoomGuard.propTypes = {
  children: PropTypes.node,
};
