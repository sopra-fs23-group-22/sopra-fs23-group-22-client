import React, {useEffect} from 'react'
import '../../styles/views/GameResult.scss'
import { useState } from 'react';
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import { Button } from 'components/ui/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomPopUp from 'components/ui/CustomPopUp';
import { red } from '@material-ui/core/colors';


const RulePopUp = ({ rules, information }) => {
  const [openRulePopUp, setOpenRulePopup] = useState(false);

  const handleRulePopUp = () => {
    setOpenRulePopup(true);
  };

  return (
    <div>
      <InfoOutlinedIcon style={{ fontSize: 50 }} onClick={handleRulePopUp} />
      <CustomPopUp open={openRulePopUp}>
        <h2>{information}</h2>
        <ul>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <button className="lobby base-container-button" onClick={() => setOpenRulePopup(false)}>
          Back
        </button>
      </CustomPopUp>
    </div>
  );
};

export default RulePopUp;
