import "styles/views/Whole.scss";
import Frame from "../ui/Frame";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import PlayerList from "../ui/PlayerList";
import StrategoSocket from "components/socket/StrategoSocket";
import LeftSideBar from "components/ui/LeftSideBar";
import NavBar from "components/ui/NavBar";
import RulePopUp from "components/ui/RulePopUp";

import LobbyContainer from "../ui/LobbyContainer";
import RoomContainer from "../ui/RoomContainer";

const Room = (props) => {
  
  const roomRules = [
    "The first player to enter the room will command the Red Army and the other one will command the Blue Army.",
    'Click on the "Enter Game" button when your opponent enters the room, both of your will go to preparing page, where you can set up the initial board for your army.',
  ];
  const roomInformation = "Are you ready to start a game? ";
  const [notAbleToStart, setnotAbleToStart] = useState(true);
  //
  // const onMessage = (msg) => {
  //   console.log(msg.length);
  //   if (msg.length === 2) {
  //     setnotAbleToStart(false);
  //   } else {
  //     setnotAbleToStart(true);
  //   }
  // };
  //
  // const gameStateChange = (msg) => {
  //   //console.log(msg.length);
  //   // if the game state is changed to "preplay", then they should both enter the game
  //   if (msg === "PRE_PLAY") {
  //     enterGame();
  //   }
  // };

  const { roomId } = useParams();

  const history = useHistory();

  // useEffect(() => {
  //   // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
  //   async function fetchPlayers() {
  //     try {
  //       const players = await api.get("/rooms/" + roomId + "/players");
  //       const playerNumber = players.data.length;
  //       if (playerNumber === 2) {
  //         setnotAbleToStart(false);
  //         console.log("setting button");
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Something went wrong while fetching the players: \n${handleError(
  //           error
  //         )}`
  //       );
  //       console.error("Details:", error);
  //       alert(
  //         "Something went wrong while fetching players! See the console for details."
  //       );
  //     }
  //   }
  //
  //   fetchPlayers();
  // }, []);

  // const enterGame = async () => {
  //   const response = await api.put(`rooms/${roomId}/game/start`);
  //   console.log(response);
  //   history.push(
  //     `/rooms/${localStorage.getItem(
  //       "roomId"
  //     )}/preparing/players/${localStorage.getItem("id")}`
  //   );
  // };

  // return (
  //   <div className="lobby row">
  //     <LeftSideBar isRenderSearchBox={true} />
  //     <div className="lobby right">
  //       <NavBar renderLobbyBtn="forRoom" renderLogoutBtn={true} />
  //       <div className="lobby right-main">
  //         <div className="lobby right-base-container">
  //           <Frame>
  //             <div className="lobby base-container-tile">Room{roomId}</div>
  //             <div className="lobby base-container-line"></div>
  //             <div className="lobby base-container-room-list">
  //               <div className="lobby online-users-list">
  //                 <PlayerList />
  //               </div>
  //             </div>
  //             <div className="lobby base-container-create-button">
  //               <button
  //                 className="lobby base-container-button"
  //                 disabled={notAbleToStart}
  //                 onClick={() => enterGame()}
  //               >
  //                 Enter Game
  //               </button>
  //             </div>
  //           </Frame>
  //         </div>
  //       </div>
  //     </div>
  //     <StrategoSocket topics="/room" onMessage={onMessage} />
  //     <StrategoSocket
  //       topics={`/room/${roomId}/state`}
  //       onMessage={gameStateChange}
  //     />
  //   </div>
  // );
  return (
    <div className="whole">
      <div className="leftSideBar">
        {/*<LeftSideBar upperList="players"/>*/}
        <LeftSideBar />
      </div>
      <div className="right">
        <NavBar renderLobbyBtn="forRoom" />
        <div className="main">
          <div className="info-container">
            <RulePopUp rules={roomRules} information={roomInformation} />
          </div>
          <RoomContainer roomId={roomId} />
        </div>
      </div>
    </div>

    //   <div className="lobby right-info-container">
    //       <RulePopUp rules={roomRules} information={roomInformation} />
    //   </div>
    //   <StrategoSocket topics="/room" onMessage={onMessage} />
    //   <StrategoSocket
    //     topics={`/room/${roomId}/state`}
    //     onMessage={gameStateChange}
    //   />
    // </div>
  );
};
export default Room;
