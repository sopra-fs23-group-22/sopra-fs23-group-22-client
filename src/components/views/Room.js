import "styles/views/Whole.scss";
import { useParams } from "react-router-dom";
import LeftSideBar from "components/ui/LeftSideBar";
import NavBar from "components/ui/NavBar";
import InfoPopUp from "components/ui/InfoPopUp";
import RoomContainer from "../ui/RoomContainer";

const Room = (props) => {
  const roomInfo = [
    "The first player to enter the room will command the Red Army and the other one will command the Blue Army.",
    'Click on the "Enter Game" button when your opponent enters the room, both of your will go to preparing page, where you can set up the initial board for your army.',
  ];
  const roomInformation = "Are you ready to start a game? ";
  const { roomId } = useParams();

  return (
    <div className="whole">
      <div className="leftSideBar">
        <LeftSideBar />
      </div>
      <div className="right">
        <NavBar renderLobbyBtn="forRoom" />
        <div className="main">
          <div className="info-container">
            <InfoPopUp info={roomInfo} information={roomInformation} />
          </div>
          <RoomContainer roomId={roomId} />
        </div>
      </div>
    </div>
  );
};
export default Room;
