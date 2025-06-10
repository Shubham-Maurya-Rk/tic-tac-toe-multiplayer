import React, { useContext, useEffect } from 'react'
import { RoomDataContext } from '../context/RoomContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RoundBanner = ({setshowRounds}) => {
    const { room } = useContext(RoomDataContext);
    useGSAP(() => {
        gsap.from('.round-text', {
            scale: 0,
            duration: 0.5,
            ease: 'bounce.out',
        });
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setshowRounds(false);
        },2000);
        return () => clearTimeout(timer);
    },[])
    return (
        <div className='bg-black bg-opacity-35 z-30 flex items-center justify-center fixed top-0 bottom-0 left-0 right-0'>
            <h1 className='text-7xl font-[samurai] font-bold tracking-wide text-yellow-500 text-shadow-lg/30 text-center round-text'>Round <br /><span className='text-[#EB1751]'>{room.rounds}</span></h1>
        </div>
    )
}

export default RoundBanner
