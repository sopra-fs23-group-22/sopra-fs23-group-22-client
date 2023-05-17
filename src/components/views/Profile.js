import "styles/views/Lobby.scss";
import "styles/ui/Frame.scss";
import "styles/views/Profile.scss";
import { useHistory, useParams } from "react-router-dom";
import OnlineUserList from "../ui/OnlineUserList";
import Myself from "../ui/Myself";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import "styles/views/Profile.scss";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import NavBar from "components/ui/NavBar";
import LeftSideBar from "components/ui/LeftSideBar";
import {scopedCssBaselineClasses} from "@mui/material";
import RoomList from "../ui/RoomList";
import ProfileContainer from "../ui/ProfileContainer";

const Profile = (props) => {

  return (
      <div className="lobby">
        <div className="sideBar">
          <LeftSideBar />
        </div>
        <div className="right">
          <NavBar renderLogoutBtn={false} renderLobbyBtn="forProfile"/>
            <div className="main">
                <ProfileContainer/>
            </div>
        </div>
      </div>
  );
};
export default Profile;
