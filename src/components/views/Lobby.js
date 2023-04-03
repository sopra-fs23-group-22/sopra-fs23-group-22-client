import 'styles/views/Lobby.scss'
import Frame from "../ui/Frame";
const Lobby = props => {
    return (
        <div className="lobby row">
            <div className="lobby left">
                <button className="lobby left-search-user">
                    Search User
                </button>
                <div className="lobby online-users">
                    <div className="lobby online-users-title">
                        Online Users
                    </div>
                    <div className="lobby user-list">
                        User List
                    </div>
                </div>
                <div className="lobby online-users">
                    <div className="lobby online-users-title">
                        Online Friends
                    </div>
                    <div className="lobby user-list">
                        Friend List
                    </div>
                </div>
            </div>
            <div className="lobby right">
                <div className="lobby right-header">
                    <button className="lobby right-home-button">
                        Home
                    </button>
                    <button className="lobby right-logout-button">
                        Logout
                    </button>
                </div>
                <div className="lobby right-main">
                    <div className="lobby right-base-container">
                        <Frame>
                            <div className="lobby base-container-tile">
                                Rooms
                            </div>
                            <div className="lobby base-container-room-list">
                                Room 1
                            </div>
                            <button className="lobby base-container-create-button">
                                Create a room
                            </button>
                        </Frame>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Lobby;