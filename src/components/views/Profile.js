import "styles/views/Whole.scss";
import "styles/ui/Frame.scss";
import NavBar from "components/ui/NavBar";
import LeftSideBar from "components/ui/LeftSideBar";
import ProfileContainer from "../ui/ProfileContainer";

const Profile = (props) => {

  return (
      <div className="whole">
        <div className="leftSideBar">
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
