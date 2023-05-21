import React from "react";
import "../../styles/views/GamePreparing.scss";
import InfoPopUp from "components/ui/InfoPopUp";
import LeftSideBar from "components/ui/LeftSideBar";
import NavBar from "components/ui/NavBar";
import "styles/views/Whole.scss";
import GamePreparingContainer from "../ui/GamePreparingContainer";
import { RuleSharp } from "@mui/icons-material";

const GamePreparing = () => {
  const setUpInfo = [
    "You can change the formation by swapping 40 pieces on the board (10 across by 4 deep), except the row with lake blocks.",
    'Click on the "Confirm" button when you are satisfied with your Army formation.',
    "Hints: How you place your army at the beginning is important and can determine whether you win or lose. When setting up your pieces, place your Flag somewhere in the back row. Place Bombs around it to protect it. Another strategy is to use Bombs as corner decoys and hide your Flag in the middle of the back row. Then place a high-ranking piece near it for protection.",
  ];
  const setUpInformation = "Set up your board!";

  return (
    <div className="whole">
      <div className="leftSideBar">
        <LeftSideBar isRenderSearchBox={false} upperList="players" />
      </div>
      <div className="right">
        <NavBar renderLogoutBtn={false} />
        <div className="main">
          <div className="info-container">
            <InfoPopUp info={setUpInfo} information={setUpInformation}>
            </InfoPopUp> 
          </div>
          <GamePreparingContainer />
        </div>
      </div>
    </div>
  );
};

export default GamePreparing;
