import React from "react";
import PropTypes from "prop-types";
import {Backdrop, Stack} from "@mui/material";
import "styles/ui/CustomPopUp.scss";

const CustomPopUp = props => {

  return (
    <Backdrop
      // apply custom styling to the Backdrop component using the sx prop from the Material UI library
      sx={{
        ...props.style,
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
      open={props.open}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onClick={props.onClick}
    >
      <div className={"popUpContainer"}>
        <Stack
          spacing={2}
          justifyContent="space-evenly"
          alignItems="center"
        >
          <div>{props.information}</div>
          {props.children}
        </Stack>
      </div>

    </Backdrop>
  );

}

CustomPopUp.defaultProps = {
  open: false,
  style: {},
};

CustomPopUp.propTypes = {
  open: PropTypes.bool,
  information: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
  style: PropTypes.object
}

export default CustomPopUp;