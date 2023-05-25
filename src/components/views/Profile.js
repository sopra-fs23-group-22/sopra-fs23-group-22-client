import "styles/views/Whole.scss";
import "styles/ui/Frame.scss";
import NavBar from "components/ui/elements/NavBar";
import LeftSideBar from "components/ui/elements/LeftSideBar";
import ProfileContainer from "../ui/containers/ProfileContainer";

const Profile = (props) => {
  return (
    <div className="whole">
      <div className="leftSideBar">
        <LeftSideBar isRenderSearchBox={true}/>
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
