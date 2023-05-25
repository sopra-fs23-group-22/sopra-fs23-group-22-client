import React from "react";
import { useState } from "react";
import { Button } from "components/ui/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomPopUp from "components/ui/CustomPopUp";

const RulePopUp = () => {
  const [openRulePopUp, setOpenRulePopup] = useState(true);

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
        <h2>Game Rules</h2>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          <ul>
            <p>
              You and your opponent <b>alternate</b> turns. The <b>red army</b>{" "}
              moves first. On your turn, you must do either <b>Move</b> or{" "}
              <b>Attack</b>.
            </p>
            <div style={{ textAlign: "center" }}>
              <b>Rules for Move</b>
            </div>
            <li>
              Only <b>one</b> piece can be moved on a turn.
            </li>
            <li>
              Pieces move <b>one</b> square at a time, forward, backward or
              sideways. (<b>Exception</b>: A Scout can move any number of open
              squares forward, backward, or sideways. But remember, this
              movement will let your opponent know the value of that piece).
            </li>
            <li>
              Pieces <b>cannot</b> move diagonally. They <b>cannot</b> jump over
              another piece. They <b>cannot</b> move onto a square already
              occupied by another piece (unless attacking).
            </li>
            <li>
              Pieces <b>cannot</b> jump over or move onto the two blue lakes in
              the center of the board.
            </li>
            <li>
              The Bomb and Flag pieces <b>cannot</b> be moved and must remain on
              the squares where they were originally placed throughout the game.
            </li>
            <p></p>
            <div style={{ textAlign: "center" }}>
              <b>Rules for Attack</b>
            </div>
            <li>
              <b>Attack position</b>: When a red and blue piece occupy adjacent
              spaces either back to back, side to side, or face to face, they
              are in a position to attack.
            </li>
            <li>
              To attack on your turn, <b>drag</b> your attacking piece and put
              it on the opponent’s piece you want to attack.{" "}
            </li>
            <li>
              The piece with the lower rank (with lower number) is removed from
              the board. If your piece (the <b>attacking piece</b>) is the
              remaining and winning piece, it moves into the space formerly
              occupied by the defending piece.{" "}
            </li>
            <li>
              If the remaining and winning piece is the <b>defending piece</b>,
              it stays on the square it was in when it was attacked.
            </li>
            <li>
              When pieces of the <b>same rank</b> battle, the attacking piece is
              the remaining and winning piece.
            </li>
            <li>
              The rank of the remaining piece after this attack will be{" "}
              <b>shown</b> to both players.
            </li>
            <p></p>
            <div style={{ textAlign: "center" }}>
              <b>Rank</b>
            </div>
            <li>
              Pieces with larger numbers <b>outrank</b> pieces with smaller
              numbers. A Marshal(rank 10) outranks a General (rank 9) and so on
              down to the Spy which is the lowest-ranking piece.
            </li>
            <li>
              Special <b>Miner</b> Privilege: When any piece (except a Miner -
              rank 3) strikes a Bomb, that piece is removed from the board. When
              a Miner strikes a Bomb, the Bomb is defused and removed from the
              board.{" "}
            </li>
            <li>
              Special <b>Spy</b> Privilege: The Spy has a unique attacking
              privilege. It is the only piece that can outrank a Marshal
              providing the Spy attacks the Marshal first. If the Marshal
              attacks first then the Spy is removed.
            </li>
          </ul>
        </div>

        <Button
          onClick={() => setOpenRulePopup(false)}
          style={{ width: "150px" }}
        >
          Back
        </Button>
      </CustomPopUp>
    </div>
  );
};

export default RulePopUp;
