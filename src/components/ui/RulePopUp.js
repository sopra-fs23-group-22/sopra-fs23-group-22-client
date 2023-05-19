import React from "react";
import { useState } from "react";
import { Button } from "components/ui/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomPopUp from "components/ui/CustomPopUp";

const RulePopUp = ({ rules, information }) => {
  const [openRulePopUp, setOpenRulePopup] = useState(false);

  const handleRulePopUp = () => {
    setOpenRulePopup(true);
  };

  return (
    <div>
      <InfoOutlinedIcon
        style={{ fontSize: 60, color: "#DBB110", cursor: "pointer" }}
        onClick={handleRulePopUp}
      />
      <CustomPopUp open={openRulePopUp}>
        <h2>{information}</h2>
        <ul>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <Button onClick={() => setOpenRulePopup(false)}>Back</Button>
      </CustomPopUp>
    </div>
  );
};

export default RulePopUp;
