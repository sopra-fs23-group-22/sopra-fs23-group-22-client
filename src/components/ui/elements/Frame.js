import React from "react";
import "styles/ui/Frame.scss";

const Frame = (props) => {
  return (
    <div className="Frame Outer">
      <div className="Frame Ring">
        <div className="Frame Inner">{props.children}</div>
      </div>
    </div>
  );
};
export default Frame;
