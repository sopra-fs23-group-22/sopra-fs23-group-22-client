import "styles/ui/PopUp.scss";

export const Popup = (props) => (
  <div id={props.id} className="modal">
    <div className="modal_content">
      <p className="label">{props.children}</p>
    </div>
  </div>
);
