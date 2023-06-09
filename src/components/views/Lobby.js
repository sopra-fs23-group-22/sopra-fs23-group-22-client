import LeftSideBar from "components/ui/elements/LeftSideBar";
import NavBar from "components/ui/elements/NavBar";
import LobbyContainer from "../ui/containers/LobbyContainer";
import "../../styles/views/Whole.scss";
import InfoPopUp from "components/ui/popUps/InfoPopUp";
import React from "react";

const Lobby = (props) => {
  const lobbyInfo = [
    "It is a 2-player strategy board game. Command your army and try to capture your opponent’s flag! ",
    "You will have 33 movable pieces (1 Marshal, rank 10; 1 General, rank 9; 2 Colonels, rank 8; 3 Majors, rank 7; 4 Captains, rank 6; 4 Lieutenants, rank 5; 4 Sergeants, rank 4; 5 Miners, rank 3; 8 Scouts, rank 2; 1 Spy, rank S ) and 7 pieces that do not move (6 Bombs and 1 Flag).",
    "Higher number indicates higher rank. Lower ranked pieces like the Miners, Scouts and Spy, have unique privileges.",
  ];
  const lobbyInformation = "Welcome to Stratego!";

  return (
    <div className="whole">
      <div className="leftSideBar">
        <LeftSideBar isRenderSearchBox={true}/>
      </div>
      <div className="right">
        <NavBar renderLogoutBtn={true}/>
        <div className="main">
          <div className="info-container">
            <InfoPopUp info={lobbyInfo} information={lobbyInformation}/>
          </div>
          <LobbyContainer/>
        </div>
      </div>
    </div>
  );
};
export default Lobby;
