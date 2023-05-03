import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "../../views/Register";
import Profile from "../../views/Profile"
import Lobby from "components/views/Lobby";
import Room from "components/views/Room";
import { GameGuard } from "../routeProtectors/GameGuard";
import GamePreparing from "components/views/GamePreparing";
import GameResult from "components/views/GameResult";
import OngoingGame from "components/views/OngoingGame";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register"><Register /></Route>
        <GameGuard>
          <Route exact path="/users/:userId/profile"><Profile /></Route>
          <Route exact path="/lobby"><Lobby /></Route>
          <Route exact path="/rooms/:id"><Room /></Route>
          <Route exact path="/rooms/:id/preparing/players/:playerId"><GamePreparing /></Route>
          <Route exact path="/rooms/:id/game/players/:playerId"><OngoingGame /></Route>
          <Route exact path="/rooms/:id/game/result"><GameResult/></Route>
        </GameGuard>
        <Route exact path="/"><Redirect to="/login"/></Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
