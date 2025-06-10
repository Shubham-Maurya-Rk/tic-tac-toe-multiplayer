import React, { useContext, useEffect, useState } from 'react'
import { RoomDataContext } from './context/RoomContext';
import ConfirmDialog from './components/ConfirmDialog';
import { useNavigate, useParams } from 'react-router-dom';
import RoomDetails from './components/RoomDetails';
import RoundBanner from './components/RoundBanner';
import Suggestion from './components/Suggestion';
import Minimax from 'tic-tac-toe-minimax'
import SinglePlayerPopUp from './components/SinglePlayerPopUp';
const { ComputerMove, GameStep } = Minimax;

const SinglePlayer = () => {
    const { difficulty } = useParams();
    const navigate = useNavigate();
    const { room, setroom } = useContext(RoomDataContext);
    const [showConfirmDialog, setshowConfirmDialog] = useState('')
    const [showSuggestion, setshowSuggestion] = useState(false)
    const [showroomDetails, setshowroomDetails] = useState(false)
    const [showRounds, setshowRounds] = useState(true)
    const [gameState, setgameState] = useState('');
    const symbols = {
        huPlayer: "X",
        aiPlayer: "O"
    }
    useEffect(() => {
        setroom({
            _id: "Not Available",
            name: "Single Player",
            status: "full",
            board: [[null, null, null], [null, null, null], [null, null, null]],
            turn: "x",
            score: {
                x: 0,
                o: 0
            },
            rounds: 1
        })
    }, [])
    useEffect(() => {
        const winner = checkWinner();
        if (room.turn === "0" && !winner) {
            setTimeout(() => {
                const { i, j } = getBotMove();
                move(i * 3 + j);
            }, 1500);
        }
        if (winner) {
            if (winner === "draw") {
                console.log("Draw")
                setgameState(winner);
                setroom(prevRoom => ({
                    ...prevRoom,
                    board: [[null, null, null], [null, null, null], [null, null, null]],
                    rounds: prevRoom.rounds + 1,
                    turn: "x"
                }));
            } else if (winner === "x") {
                setgameState("You Win!");
                setroom(prevRoom => ({
                    ...prevRoom,
                    rounds: prevRoom.rounds + 1,
                    score: { ...prevRoom.score, x: prevRoom.score.x + 1 },
                    board: [[null, null, null], [null, null, null], [null, null, null]],
                    turn: "x"
                }));
            } else {
                setgameState("You Lose!");
                setroom(prevRoom => ({
                    ...prevRoom,
                    rounds: prevRoom.rounds + 1,
                    score: { ...prevRoom.score, o: prevRoom.score.o + 1 },
                    board: [[null, null, null], [null, null, null], [null, null, null]],
                    turn: "x"
                }));
            }
        }
    }, [room.turn]);
    const get1DBoard = (board) => {
        const arr = [];
        let idx = 0
        board.forEach((element) =>
            element.forEach(elem => {
                arr.push(elem === null ? idx : elem == 'x' ? 'X' : 'O')
                idx++
            })
        );
        return arr;
    }
    const getBotMove = () => {
        const board = get1DBoard(room.board);
        const nextMove = ComputerMove(board, symbols, difficulty);
        return {
            i: Math.floor(nextMove / 3),
            j: nextMove % 3,
        };
    };

    const toArray = () => {
        const arr = [];
        room.board.forEach(element =>
            element.forEach(elem => arr.push(elem))
        );
        return arr;
    }
    const validateTurn = () => {
        return room.turn === 'x';
    }
    const checkWinner = () => {
        for (let i = 0; i < 3; i++) {
            if (room.board[i][0] === room.board[i][1] && room.board[i][0] === room.board[i][2] && room.board[i][0] !== null) return room.board[i][0];
            if (room.board[0][i] === room.board[1][i] && room.board[0][i] === room.board[2][i] && room.board[0][i] !== null) return room.board[0][i];
        }
        if (room.board[0][0] === room.board[1][1] && room.board[0][0] === room.board[2][2] && room.board[0][0] !== null) return room.board[0][0];
        if (room.board[0][2] === room.board[1][1] && room.board[0][2] === room.board[2][0] && room.board[0][2] !== null) return room.board[0][2];
        if (toArray().every(cell => cell !== null)) return "draw";
        return null;
    }
    const move = (idx) => {
        const i = Math.floor(idx / 3);
        const j = Math.floor(idx % 3);
        setroom({ ...room, board: room.board.map((row, rowIndex) => row.map((col, colIndex) => colIndex === j && rowIndex === i ? room.turn : col)), turn: room.turn === 'x' ? '0' : 'x' })
    }
    const handleLeave = () => {
        navigate('/')
    }
    return (<>
        {gameState && <SinglePlayerPopUp gameState={gameState} setgameState={setgameState} setshowRounds={setshowRounds} />}
        {showRounds && <RoundBanner setshowRounds={setshowRounds} />}
        {showroomDetails && <RoomDetails setshowroomDetails={setshowroomDetails} />}
        {showConfirmDialog && <ConfirmDialog text={showConfirmDialog} onYes={handleLeave} onNo={() => setshowConfirmDialog('')} />}
        <div className='w-full h-screen bg-[#321d80] relative px-3 overflow-hidden'>
            <div className='w-full h-[10%] flex items-center justify-end'>
                <div className='flex items-center gap-3'>
                    <button onClick={() => setshowConfirmDialog("Are you sure you want to leave?")} className='py-3 px-5 text-[#EB1751] text-lg font-[samurai] tracking-wider rounded-md bg-yellow-500 font-bold'>Leave</button>
                    {showSuggestion && validateTurn() && <Suggestion setshowSuggestion={setshowSuggestion} />}
                    <button onClick={() => setshowSuggestion(v => !v)} className=''><i className="ri-lightbulb-fill text-yellow-500 text-4xl"></i></button>
                    <button onClick={() => setshowroomDetails(v => !v)} className=''><i className="ri-information-2-line text-yellow-500 text-4xl"></i></button>
                </div>
            </div>
            <div className='h-[30%] flex justify-evenly items-center'>
                <div className={`${room.turn === 'x' ? 'turn' : ''} w-1/3 flex flex-col items-center h-[80%] bg-[#27175D] border border-white rounded-2xl p-2`}>
                    <div className='w-[70px] h-[70px] bg-white rounded-full overflow-hidden'>
                        <img src="/player1.png" className='w-full h-full object-cover' alt="player 1" />
                    </div>
                    <div className='text-white my-3 font-semibold font-[samurai] text-sm tracking-widest'>You</div>
                    <span className='font-extrabold text-[4em] text-[#EB1751] leading-[0]'>x</span>
                </div>
                <div className={`${room.turn === '0' ? 'turn' : ''} w-1/3 flex flex-col items-center h-[80%] bg-[#27175D] border border-white rounded-2xl p-2`}>
                    <div className='w-[70px] h-[70px] bg-white rounded-full overflow-hidden'>
                        <img src="/player2.jpg" className='w-full h-full object-cover' alt="player 2" />
                    </div>
                    <div className='text-white my-3 font-semibold font-[samurai] text-sm tracking-widest'>Bot</div>
                    <span className='font-extrabold text-[4em] text-yellow-500 leading-[0]'>o</span>
                </div>
            </div>
            <div className={`${validateTurn() ? '' : 'pointer-events-none'} h-[50%] flex justify-center`}>
                <div className='bg-[#6344d2fa] h-[90vw] w-[90vw] rounded-2xl justify-around flex flex-wrap items-center'>
                    {
                        toArray().map((elem, i) => {
                            return <div key={`board-${i}`} className={`${elem ? 'pointer-events-none' : ''} w-[30%] h-[30%] bg-[#332167] p-0 m-0 div-center rounded-2xl`} onClick={() => move(i)}>
                                {elem === 'x' ? <i className="ri-close-line text-[#EB1751] font-extrabold text-[6em]"></i> :
                                    elem === '0' ? <i className="ri-circle-line text-yellow-500 font-extrabold text-[4em]"></i> : <></>}
                            </div>
                        })
                    }
                </div>
            </div>
            {/* <button ref={buttonRef} onClick={() => setshowMsgDialog(prev => !prev)} className='bg-yellow-500 fixed top-[75%] right-0 px-2 py-2 rounded-full shadow-md z-50 cursor-pointer'><i className="ri-chat-ai-fill text-3xl text-[#EB1751]"></i></button> */}
        </div>
    </>
    )
}

export default SinglePlayer
