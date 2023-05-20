import React from "react";
import { api } from "../../helpers/api";
import { Button } from "components/ui/Button";
import CustomPopUp from "components/ui/CustomPopUp";

const ResignConfirmationPopUp = ({ show, onClose }) => {
  const roomId = localStorage.getItem("roomId");
  const playerId = localStorage.getItem("id");
  const handleResignConfirmed = async () => {
    onClose();
    // ... code to resign
    let requestBody = JSON.stringify({ playerIdResigned: playerId });
    await api.put(`/rooms/${roomId}/resign`, requestBody);
  };

  const handleResignCancelled = () => {
    onClose();
  };

  return (
    <CustomPopUp open={show} information="">
      Are you sure you want to resign?<br></br>
      You will lose the game and your opponent will win.
      <Button
        onClick={() => handleResignConfirmed()}
        style={{ width: "150px" }}
      >
        YES!
      </Button>
      <Button
        onClick={() => handleResignCancelled()}
        style={{ width: "150px" }}
      >
        No
      </Button>
    </CustomPopUp>
  );
};

export default ResignConfirmationPopUp;
