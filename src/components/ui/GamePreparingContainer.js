import React, {useEffect, useState} from "react";
import Square from "./Square";
import Piece from "./Piece";
import {useHistory, useParams} from "react-router-dom";
import {Spinner} from "./Spinner";
import {api, handleError} from "../../helpers/api";
import ConfigurationModel from "../../models/ConfigurationModel";
import CustomPopUp from "./CustomPopUp";
import StrategoSocket from "../socket/StrategoSocket";
import "styles/ui/GamePreparingContainer.scss";
const GamePreparingContainer = () => {
    const DefaultBoard = (props) => {
        const {army, pattern} = props;
        console.log(`army type: ${army}`);
        const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);
        let positionToBeSwapped = null;

        const handlePieceClick = (row, col) => {
            // if the first position is not selected yet
            if (selectedPiecePosition === null) {
                // assign the position to the variable
                setSelectedPiecePosition([row, col]);
            } else {
                // store the position of the other selected piece
                positionToBeSwapped = [row, col];
                pattern.swapPieces(selectedPiecePosition, positionToBeSwapped);
                setSelectedPiecePosition(null);
            }
        };

        const board = [];
        const pieces = pattern.configuration;
        console.log(pieces);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                const pieceType = pieces[i][j];
                if (pieceType === "LAKE") {
                    board.push(
                        <Square key={`${i}-${j}`} value={i + j + 2} type={"LAKE"}/>
                    );
                } else {
                    const piece =
                        pieceType !== null ? (
                            <Piece
                                type={pieceType}
                                army={army}
                                onClick={() => handlePieceClick(i, j)}
                            />
                        ) : null;
                    board.push(
                        <Square key={`${i}-${j}`} value={i + j + 2} content={piece}/>
                    );
                }
            }
        }

        return <div className="defaultBoard">{board}</div>;
    };

    const setUpRules = ['You can change the formation by swapping 40 pieces on the board (10 across by 4 deep), except the row with lake blocks.',
        'Click on the "Confirm" button when you are satisfied with your Army formation.',
        'Hints: How you place your army at the beginning is important and can determine whether you win or lose. When setting up your pieces, place your Flag somewhere in the back row. Place Bombs around it to protect it. Another strategy is to use Bombs as corner decoys and hide your Flag in the middle of the back row. Then place a high-ranking piece near it for protection.'];
    const setUpInformation = 'Set up your board!';
    const {roomId, playerId} = useParams();
    const [rightContent, setRightContent] = useState(<Spinner/>);
    const history = useHistory();
    let gameState = null;
    let configuration = null;
    let armyType = null;

    const onMessage = (msg) => {
        gameState = msg;
        console.log(msg);
        if (gameState === "IN_PROGRESS") {
            console.log("successful");
            history.push(`/rooms/${roomId}/game/players/${playerId}`);
        }
    };

    useEffect(() => {
        async function fetchPlayers() {
            console.log("use effect fetch players");
            try {
                const room = await api.get("/rooms/" + roomId);
                const players = room.data.userIds;
                const currentPlayer = localStorage.getItem("id");
                if (currentPlayer === JSON.stringify(players[0])) {
                    armyType = "red";
                } else if (currentPlayer === JSON.stringify(players[1])) {
                    armyType = "blue";
                }
                localStorage.setItem("armyType", armyType);
                configuration = new ConfigurationModel(armyType);
                setRightContent(
                    <div className="boardAndButton">
                        {/*<DefaultBoard army={armyType} pattern={configuration}/>*/}
                        <div className="boardArea">
                            <DefaultBoard army={armyType} pattern={configuration}/>
                        </div>
                        <div className="buttonArea">
                            <button className="button" onClick={doConfirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                );
            } catch (error) {
                console.error(
                    `Something went wrong while fetching the players: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert(
                    "Something went wrong while fetching the players! See the console for details."
                );
            }
        }

        fetchPlayers();
    }, []);

    const doConfirm = async () => {
        try {
            const requestBody = JSON.stringify(configuration.getPieces());
            const response = await api.put(`/rooms/${roomId}/setBoard`, requestBody);
            console.log(response);
            if (response.data === "PRE_PLAY") {
                console.log("preparing");
                setRightContent(
                    <div>
                        <CustomPopUp
                            open={true}
                            information="Please wait for your opponent to set the Board."
                        >
                            <Spinner/>
                        </CustomPopUp>
                    </div>
                );
            } else if (response.data === "IN_PROGRESS") {
                console.log("successful");
                history.push(`/rooms/${roomId}/game/players/${playerId}`);
            }
        } catch (error) {
            console.error(
                `Something went wrong while sending the board: \n${handleError(error)}`
            );
            console.error("Details:", error);
            alert(
                "Something went wrong while sending the board! See the console for details."
            );
        }
    };
    return (
        <div className="container">
            {rightContent}
            <StrategoSocket topics={"/loading/" + roomId} onMessage={onMessage} />
        </div>
            );
}
export default GamePreparingContainer;