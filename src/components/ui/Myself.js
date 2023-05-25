import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "./elements/Spinner";
import {useHistory} from "react-router-dom";
import "../../styles/ui/LeftSideBar.scss";
import StrategoSocket from "../socket/StrategoSocket";

const Myself = (props) => {
  const history = useHistory();
  const [myself, setMyself] = useState(null);
  const userId = localStorage.getItem("id");
  const onMessage = (msg) => {
    setMyself(msg);
  }
  const Myself = ({user}) => (
    <div className="item" onClick={() => profile(user.id)}>
      {user.username}
    </div>
  );
  const profile = (userId) => {
    history.push(`/users/profile/${userId}`);
  };
  Myself.propTypes = {
    user: PropTypes.object,
  };
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchMyself() {
      try {
        const response = await api.get("/users/" + userId);
        setMyself(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
      }
    }

    fetchMyself();
  }, []);
  let listContent1 = <Spinner/>;
  if (myself) {
    listContent1 = <Myself user={myself} key={myself.id}/>;
  }
  return (
    <div>
      {listContent1}
      <StrategoSocket topics={`/users/${userId}`} onMessage={onMessage}/>
    </div>);
};
export default Myself;
