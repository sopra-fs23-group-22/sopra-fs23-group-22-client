import RoomList from "./RoomList";
import PlayerList from "./PlayerList";
import "styles/ui/PlayerListContainer.scss";
const PlayersContainer = ()=> {
    return (
        <div className="container">
            <div className="title">
                Waiting room
            </div>
            <div className="content">
                <PlayerList/>
            </div>
            <div className="buttonArea">
                <button className="button">
                    Start game
                </button>
            </div>
        </div>
    );
}
export default PlayersContainer;