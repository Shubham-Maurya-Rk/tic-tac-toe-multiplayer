import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react'
import { RoomDataContext } from '../context/RoomContext';

const SinglePlayerPopUp = ({ gameState, setgameState, setshowRounds }) => {
    const { room } = useContext(RoomDataContext);
    const [time, settime] = useState(5)
    const ref = useRef(null);
    const navigate = useNavigate();
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
            if (gameState?.includes("left")) navigate('/');
        }

        const interval = setInterval(() => {
            settime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);
    return (
        <div ref={ref} className='w-full h-screen div-center absolute z-50 bg-transparent shadow' style={gameState==="You Win!" ? {
            backgroundImage: `url('/party.gif')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } : {}}>
            <div className='bg-yellow-500 border border-white p-3 rounded-2xl w-4/5  flex flex-col items-center'>
                <h2 className='font-[samurai] text-4xl mt-5 uppercase text-[#EB1751]'>{gameState}
                    {/* <i className="ri-thumb-up-fill"></i> */}
                </h2>
                <div className='w-2/3 h-2/3 my-3 bg-white rounded-full'>
                    <img src={gameState==="You Win!" ? "/win.png" : "/loose.png"} alt="" />
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
            </div>
        </div>
    )
}

export default SinglePlayerPopUp
