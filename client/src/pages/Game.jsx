import { useContext, useEffect, useRef, useState } from 'react'
import { RoomDataContext } from '../context/RoomContext';
import { socket } from '../socket';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import GamePopup from '../components/GamePopup';
import ChatDialog from '../components/ChatDialog';
import MsgAlert from '../components/MsgAlert';
import Suggestion from '../components/Suggestion';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import RoomDetails from '../components/RoomDetails';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import RoundBanner from '../components/RoundBanner';
gsap.registerPlugin(Draggable);

const Game = () => {
  const { room, setroom } = useContext(RoomDataContext);
  const { user } = useContext(UserDataContext);
  const [gameState, setgameState] = useState('');
  const [spectators, setspectators] = useState(0)
  const [showMsgDialog, setshowMsgDialog] = useState(false)
  const [showroomDetails, setshowroomDetails] = useState(false)
  const [showConfirmDialog, setshowConfirmDialog] = useState('')
  const [showRounds, setshowRounds] = useState(true)
  const moveState = useRef(true)
  const [msgState, setmsgState] = useState({
    name: "",
    msg: ""
  })
  const [showSuggestion, setshowSuggestion] = useState(false)
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useGSAP(() => {
    const button = buttonRef.current;

    Draggable.create(button, {
      type: "y",
      bounds: window,
      inertia: true
    });
  }, []);

  useEffect(() => {
    if (!room ||!room._id) {
      navigate('/');
      return
    }
    socket.connect();
    socket.on('connect', () => {
      socket.emit('joinRoom', room._id);
      socket.emit('send-msg', { name: user.name, msg: "Joined the room", roomId: room._id });
    });
    socket.on('room-details', ({ data, roomSize }) => {
      setroom({ ...data });
      setspectators(roomSize > 1 ? roomSize - 2 : 0);
      moveState.current = true
    });

    socket.on('winner', (winner) => {
      setgameState(`${winner.toUpperCase()} WON!`);
      if (room.players.x._id === user._id) socket.emit('restartGame', { roomId: room._id,  winner: winner.toUpperCase() });
    });
    
    socket.on('gameOver', () => {
      setgameState(`Match Tie!`);
      if (room.players.x._id === user._id) socket.emit('restartGame', { roomId: room._id, winner: '_' });
    });
    socket.on('msg', ({ name, msg }) => {
      setmsgState({ name, msg });
    });
    socket.on('error', (error) => {
      toast.error(error.message);
    });
    return () => {
      socket.off('connect');
      socket.off('room-details');
      socket.off('winner');
      socket.off('gameOver');
      socket.off('msg');
      socket.off('error');
    }
  }, [])
  useEffect(() => {
    if (msgState.name) {
      const timer = setTimeout(() => {
        setmsgState({ name: "", msg: "" });
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Clear if unmounted or msgState changes early
    }
  }, [msgState.name])

  const handleLeave = () => {
    if (room.players.x._id === user._id || room.players.o._id === user._id) socket.emit('leaveGame', { roomId: room._id, player: room.players.x._id === user._id ? 'x' : '0' });
    navigate('/');
  }
  useEffect(() => {
    socket.on('destroy', (player) => {
      setgameState(`Player ${player} left`);
    });

    return () => {
      setroom({});
      socket.emit('leaveRoom', room._id);
      socket.off('destroy');
      socket.off('leaveRoom');
      socket.disconnect();
    };
  }, [navigate]);
  useEffect(() => {
    const handleUnload = () => {
      if (room && room._id && user && room.players) {
        const player = room.players.x._id === user._id ? 'x' : '0';
        socket.emit('leaveGame', { roomId: room._id, player });
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [room, user]);

  const toArray = () => {
    const arr = [];
    room.board.forEach(element =>
      element.forEach(elem => arr.push(elem))
    );
    return arr;
  }
  const move = (idx) => {
    if (!room.players.o) return toast.error("Wait for other player to join");
    if (!validateTurn()) return toast.error("Wait for your turn");
    moveState.current = false
    const i = Math.floor(idx / 3);
    const j = Math.floor(idx % 3);
    socket.emit('move', { roomId: room._id, i, j, player: room.turn })
  }

  const validateTurn = () => {
    return (room.turn === 'x' && room.players.x._id === user._id) || (room.players.o && room.turn === '0' && room.players.o._id === user._id);
  }


  return (<>
    {showRounds && <RoundBanner setshowRounds={setshowRounds} />}
    {showroomDetails && <RoomDetails setshowroomDetails={setshowroomDetails} />}
    {showConfirmDialog && <ConfirmDialog text={showConfirmDialog} onYes={handleLeave} onNo={() => setshowConfirmDialog('')} />}
    {showMsgDialog && <ChatDialog socket={socket} setshowMsgDialog={setshowMsgDialog} />}
    {gameState && <GamePopup gameState={gameState} setgameState={setgameState} setshowRounds={setshowRounds} handleLeave={handleLeave} />}
    <div className='w-full h-screen bg-[#321d80] relative px-3 overflow-hidden'>
      <div className='w-full h-[10%] flex items-center justify-between'>
        <div className='bg-[#0000008e] flex text-white py-2 px-3 gap-2 rounded-3xl'>
          <i className="ri-eye-line"></i>
          <p className='font-bold'>{spectators}</p>
        </div>
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
          <div className='text-white my-3 font-semibold font-[samurai] text-sm tracking-widest'>{room.players.x._id === user._id ? 'You' : room.players.x.name}</div>
          <span className='font-extrabold text-[4em] text-[#EB1751] leading-[0]'>x</span>
        </div>
        <div className={`${room.turn === '0' ? 'turn' : ''} w-1/3 flex flex-col items-center h-[80%] bg-[#27175D] border border-white rounded-2xl p-2`}>
          <div className='w-[70px] h-[70px] bg-white rounded-full overflow-hidden'>
            <img src="/player2.jpg" className='w-full h-full object-cover' alt="player 2" />
          </div>
          <div className='text-white my-3 font-semibold font-[samurai] text-sm tracking-widest'>{room.players.o
            ? room.players.o._id === user._id
              ? 'You'
              : room.players.o.name
            : 'Waiting...'}</div>
          <span className='font-extrabold text-[4em] text-yellow-500 leading-[0]'>o</span>
        </div>
      </div>
      <div className={`${validateTurn() && moveState.current ? '' : 'pointer-events-none'} h-[50%] flex justify-center`}>
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
      {msgState.name && <MsgAlert msg={msgState} />}
      <button ref={buttonRef} onClick={() => setshowMsgDialog(prev => !prev)} className='bg-yellow-500 fixed top-[75%] right-0 px-2 py-2 rounded-full shadow-md z-50 cursor-pointer'><i className="ri-chat-ai-fill text-3xl text-[#EB1751]"></i></button>
    </div>
  </>)
}

export default Game

