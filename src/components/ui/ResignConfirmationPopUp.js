import React, { useEffect } from "react";
import "../../styles/views/GameResult.scss";
import { useState } from "react";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../ui/Spinner";
import user from "../../models/User";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import CustomPopUp from "components/ui/CustomPopUp";
import StrategoSocket from "../socket/StrategoSocket";

const ResignConfirmationPopUp = ({ show, onClose }) => {
  const roomId = localStorage.getItem("roomId");
  const playerId = localStorage.getItem("id");
  const handleResignConfirmed = async () => {
    onClose();
    // ... code to resign
    let requestBody = JSON.stringify({playerIdResigned: playerId});
    await api.put(`/rooms/${roomId}/resign`, requestBody);
  }

  const handleResignCancelled = () => {
    onClose();
  }

  return (
    <CustomPopUp open={show} information="">
      Are you sure you want to resign? You will lose the game and your opponent will win.
      <Button className="lobby base-container-button" onClick={() => handleResignConfirmed()}
      >
        YES!
      </Button>
      <Button className="lobby base-container-button" onClick={() => handleResignCancelled()}>
        No
      </Button>
    </CustomPopUp>
  );
};

export default ResignConfirmationPopUp;
