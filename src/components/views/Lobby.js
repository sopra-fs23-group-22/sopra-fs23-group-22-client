import 'styles/views/Lobby.scss'
import 'styles/views/Game.scss'
import Frame from "../ui/Frame";
// import {Button} from "../ui/Button";
import {Spinner} from "../ui/Spinner";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

const OnlineUsers = ({user}) => (
    <div className="player container">
      <div className="lobby user-list-username">{user.username}</div>
      {/* <div className="player name">{user.name}</div> */}
      {/* <div className="player id">id: {user.id}</div> */}
    </div>
  );

  OnlineUsers.propTypes = {
    user: PropTypes.object
  };

// const Myself = ({user}) => (
//     <div className="lobby user-myself-username">{user.username}</div>
// );
// const onlineUsers = ({user}) => (
//     <div>
//         <div className="lobby user-list-username">{user.username}</div>
//         {/* <span>
//           <a href=""> <img scr="" alt=""> </img> </a>
//         </span> */}
//     </div>

// );
const Lobby = props => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    //test message
    const [users, setUsers] = useState(null);
    // const [user, setUser] = useState(null);
    // const [friends, setFriends] = useState(null);
    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users/online');

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.

                // See here to get more data.

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();

    }, []);

    // let online = <div className="lobby user"> </div>;
    let content = <Spinner/>;

    // if (users) {
    //     content = (
    //         <div className= "lobby user-list-username">
    //             <ul className='lobby online-user-list'>
    //             {users.map(user => (
    //             <onlineUsers user={user} key={user.id}/>
    //             ))}
    //             </ul>
    //       </div>
    //       );
    // }


    if (users) {
        content = (
          <div className="game">
            <ul className="game user-list">
              {users.map(user => (
                <OnlineUsers user={user} key={user.id}/>
              ))}
            </ul>
          </div>
        );
      }
    
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
                    <div className="lobby user-myself">
                        {/* {Myself} */}
                        <img className="lobby user-myself-edit" alt="Box" src="https://cdn-icons-png.flaticon.com/512/3745/3745484.png"/>
                    </div>
                    <div className="lobby user-list">
                        {content}
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