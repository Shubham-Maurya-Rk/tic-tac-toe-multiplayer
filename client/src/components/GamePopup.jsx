import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react'
import { RoomDataContext } from '../context/RoomContext';
import { UserDataContext } from '../context/UserContext';

const GamePopup = ({ gameState, setgameState, setshowRounds, handleLeave }) => {
    const ref = useRef(null);
    const [time, settime] = useState(5)
    const { room } = useContext(RoomDataContext);
    const { user } = useContext(UserDataContext);
    const navigate = useNavigate();
    const getText = () => {
        if (gameState === 'X WON!') {
            if (room.players.x._id === user._id) return 'You won!';
            else if (room.players.o._id === user._id) return 'You lost!';
            else return gameState.toLowerCase();
        }
        else if (gameState === '0 WON!') {
            if (room.players.x._id === user._id) return 'You lost!';
            else if (room.players.o._id === user._id) return 'You won!';
            else return gameState.toLowerCase();
        } else return gameState.toLowerCase()
    }
    useGSAP(() => {
        gsap.from(ref.current, {
            scale: 0,
            duration: 0.8
        })
    }, [])
    useEffect(() => {
        if (time === 0) {
            setgameState('');
            setshowRounds(true);
            if(gameState?.includes("left")) navigate('/');
        }

        const interval = setInterval(() => {
            settime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);
    return (
        <div ref={ref} className='w-full h-screen div-center absolute z-50 bg-transparent shadow' style={getText(gameState).includes('won') ? {
            backgroundImage: `url('/party.gif')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } : {}}>
            <div className='bg-yellow-500 border border-white p-3 rounded-2xl w-4/5  flex flex-col items-center'>
                <h2 className='font-[samurai] text-4xl mt-5 uppercase text-[#EB1751]'>{getText(gameState)}
                    {/* <i className="ri-thumb-up-fill"></i> */}
                </h2>
                <div className='w-2/3 h-2/3 my-3 bg-white rounded-full'>
                    <img src={getText(gameState).includes('won') ? "/win.png" : "/loose.png"} alt="" />
                </div>
                <div className='w-full text-center flex gap-2 mt-2'>
                    <div className='w-1/2 py-4 bg-[#EB1751] rounded-xl text-white'>
                        <h2 className='font-[samurai]'>X score</h2>
                        <p className='text-4xl font bold'>{room.score.x}</p>
                    </div>
                    <div className='w-1/2 py-4 bg-[#321d80] rounded-xl text-white '>
                        <h2 className='font-[samurai]'>O score</h2>
                        <p className='text-4xl font bold'>{room.score.o}</p>
                    </div>
                </div>
                <div className='w-full flex justify-center p-3 font-bold rounded-xl my-2 text-yellow-500 text-2xl uppercase py-3 bg-[#321d80]   font-[samurai] tracking-wide'>{time} <i className="ri-time-9-line"></i></div>
                {(!gameState?.includes('left') && (room.players.x._id === user._id || room.players.o._id === user._id)) && <button onClick={handleLeave} className='w-full p-3 font-bold rounded-xl bg-[#Eb1751] text-2xl uppercase py-3 text-white   font-[samurai] tracking-wide'>End Game <i className="ri-restart-line"></i></button>}
            </div>
        </div>
    )
}

export default GamePopup
