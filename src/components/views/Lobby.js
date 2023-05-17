import "styles/views/Lobby.scss";
import Frame from "../ui/Frame";
import { api, handleError } from "../../helpers/api";
import { useHistory } from "react-router-dom";
import RoomList from "../ui/RoomList";
import RulePopUp from "components/ui/RulePopUp";
import LeftSideBar from "components/ui/LeftSideBar";
import NavBar from "components/ui/NavBar";
import {useEffect, useState} from "react";
import RoomListContainer from "../ui/RoomListContainer";
// import "../../styles/ui/NavBar.scss";

const Lobby = (props) => {
    const gameResultRules = ['It is a 2-player strategy board game. Command your army and try to capture your opponent’s flag! ',
        'You will have 33 movable pieces (1 Marshal, rank 10; 1 General, rank 9; 2 Colonels, rank 8; 3 Majors, rank 7; 4 Captains, rank 6; 4 Lieutenants, rank 5; 4 Sergeants, rank 4; 5 Miners, rank 3; 8 Scouts, rank 2; 1 Spy, rank S ) and 7 pieces that do not move (6 Bombs and 1 Flag).',
        'Higher number indicates higher rank. Lower ranked pieces like the Miners, Scouts and Spy, have unique privileges.'];
    const gameResultInformation = 'Welcome to Stratego!';

    return (
        <div className="lobby">
            <div className="leftSideBar">
                <LeftSideBar />
            </div>
            <div className="right">
                <NavBar renderLogoutBtn={true} />
                <div className="main">
                    <RoomListContainer/>
                </div>
            </div>
        </div>
    );
};
export default Lobby;
