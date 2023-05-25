import React, {useState} from "react";
import {Button} from "components/ui/elements/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomPopUp from "components/ui/popUps/CustomPopUp";

const InfoPopUp = ({info, information}) => {
  const [openInfoPopUp, setOpenInfoPopup] = useState(false);

  const handleInfoPopUp = () => {
    setOpenInfoPopup(true);
  };

  return (
    <div>
      <InfoOutlinedIcon
        style={{fontSize: 60, color: "#DBB110", cursor: "pointer"}}
        onClick={handleInfoPopUp}
      />
      <CustomPopUp open={openInfoPopUp}>
        <h2>{information}</h2>
        <ul>
          {info.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <Button
          onClick={() => setOpenInfoPopup(false)}
          style={{width: "150px"}}
        >
          Back
        </Button>
      </CustomPopUp>
    </div>
  );
};

export default InfoPopUp;
