import { useContext, useState } from 'react'
import TicTacToeBanner from '../components/TicTacToeBanner'
import { UserDataContext } from '../context/UserContext';
import { RoomDataContext } from '../context/RoomContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Settings from '../components/Settings';
import { useEffect } from 'react';

const Home = () => {
  const { user } = useContext(UserDataContext);
  const { setroom } = useContext(RoomDataContext);
  const navigate = useNavigate();
  const [roomName, setroomName] = useState('');
  const [availableRooms, setavailableRooms] = useState({
    full: 0,
    waiting: 0
  })
  useEffect(() => {
    const fetchRooms = async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/room/available-rooms`);
      setavailableRooms({ full: res.data.full, waiting: res.data.waiting });
    }
    fetchRooms();
  }, [])

  const newGame = async () => {
    try {
      if (!roomName.trim()) return toast.error("Room name should contain alphanumeric characters");
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/room/create`, { name: roomName, x_id: user._id });
      setroom(res.data.room);
      navigate('/game');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
  const joinGame = async () => {
    try {
      if (roomName!=='' && !roomName.trim()) return toast.error("Room name should contain alphanumeric characters");
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/room/join`, { o_id: user._id, roomId: roomName });
      setroom(res.data.room);
      navigate('/game');
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  return (
    <div className='w-full h-screen bg-[#321d80] relative'>
      <Settings />
      <div className='div-center flex-col h-[60%] p-5'>
        <TicTacToeBanner />
      </div>
      <div className='w-full absolute bottom-10 px-5 flex flex-col gap-3'>
        <h2 className='text-white font-[samurai] text-4xl'>St<span className='text-[#EB1751]'>ar</span>t Playing !
        </h2>
        <input type="text" maxLength={30} value={roomName} onChange={(e) => setroomName(e.target.value)} className='w-full text-lg outline-none   rounded-2xl p-3  text-center placeholder:uppercase' placeholder='Room name/Id' />
        <button onClick={newGame} className='w-full font-bold rounded-xl bg-yellow-500 text-lg uppercase py-3 text-[#EB1751]'>New game <i className="ri-gamepad-line"></i></button>
        <button onClick={joinGame} className='w-full font-bold rounded-xl text-yellow-500 text-lg uppercase py-3 bg-[#EB1751]'>Join game [{availableRooms.waiting}] <i className="ri-home-9-fill"></i></button>
        <div className='flex gap-1'>
          <Link to={'/single-player'} className='w-1/2 text-center font-bold rounded-xl text-md uppercase py-3 button-color-2'>Single <i className="ri-user-fill"></i></Link>
          <Link to={'/wars'} className='w-1/2 text-center font-bold rounded-xl  text-md uppercase py-3 button-color-1'>Wars [{availableRooms.full}] <i className="ri-sword-fill"></i></Link>
        </div>
      </div>
    </div>
  )
}

export default Home
