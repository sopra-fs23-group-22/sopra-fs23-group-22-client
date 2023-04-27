import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "../../views/Register";
import Profile from "../../views/Profile"
import OngoingGame from "components/views/OngoingGame";
import * as PropTypes from "prop-types";
import Lobby from "components/views/Lobby";
import Room from "components/views/Room";
import GamePreparing from "components/views/GamePreparing";
import { ImportExport } from "@material-ui/icons";
import GameResult from "components/views/GameResult";
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
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game"/>
          </GameGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <Register/>
        </Route>
        <Route exact path="/">
          <Redirect to="/game"/>
        </Route>
        <Route exact path="/lobby">
          <Lobby/>
        </Route>
        <Route exact path="/room">
          <Room/>
        </Route>
        <Route exact path='/profile'>
          <Profile/>
        </Route>
        <Route exact path='/gamePreparing'>
          <GamePreparing/>
        </Route>
        <Route exact path="/gameResult">
          <GameResult/>
        </Route>
        <Route exact path="/ongoingGame">
          <OngoingGame/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
