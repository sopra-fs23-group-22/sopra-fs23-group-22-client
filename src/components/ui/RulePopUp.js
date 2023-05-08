import React, {useEffect} from 'react'
import '../../styles/views/GameResult.scss'
import { useState } from 'react';
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import { Button } from 'components/ui/Button';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CustomPopUp from 'components/ui/CustomPopUp';
import { red } from '@material-ui/core/colors';
const RulePopUp = () => {

    const [openRulePopUp, setOpenRulePopup] = useState(false);

    const handleRulePopUp = () => {
        setOpenRulePopup(true);
      };
    
    return (
        
        <div>
            <InfoOutlinedIcon style={{ fontSize: 50 }} onClick={handleRulePopUp}> </InfoOutlinedIcon>
            <CustomPopUp open={openRulePopUp} information={"Here are the rules of the game:"}>
                <ul>
                    <li>Rule 1</li>
                    <li>Rule 2</li>
                    <li>Rule 3</li>
                    <li>Rule 4</li>
                </ul>
                <button className="lobby base-container-button" onClick={() => setOpenRulePopup(false)}>Back</button>              
            </CustomPopUp>
        </div>
    )
}
export default RulePopUp;