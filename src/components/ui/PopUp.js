import "styles/ui/PopUp.scss";
import { Spinner } from "./Spinner";

export const Popup = props => (
    <div id={props.id} className="modal">
        <div className="modal_content">
            <p className="label">{props.children}</p>
            {/* <Spinner/> */}
            {/* <button className="close">Close</button> */}
        </div>
    </div>
);

// export const BlockPopup = props => (
//     <div id={props.id} className="modal">
//         <div className="modal_content">
//             <p className="label">{props.children}</p>
//         </div>
//     </div>
// );

  
