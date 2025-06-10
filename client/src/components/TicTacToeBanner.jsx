import React from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const TicTacToeBanner = () => {
    useGSAP(() => {
        gsap.from('h1', {
            x: -300,
            duration: 1,
            stagger: 0.3
        })
        gsap.from('.bg-anim', {
            x: -300,
            duration: 1,
        })
        gsap.to('.F', {
            rotation: 360,
            repeat: -1,
            duration: 1.2
        })
        gsap.to('.B', {
            rotation: -360,
            repeat: -1,
            duration: 1.2
        })
        gsap.to('.bg-anim', {
            rotation: -360,
            repeat: -1,
            ease: 'none',
            duration: 1.2
        })
    });

    return (
        <>
            <div className='text-[#EB1751] bg-anim text-shadow text-xl absolute top-[15%]  right-10'>o</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-3xl absolute top-[2%]  right-3'>o</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-xl absolute top-5  right-[50%]'>x</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-3xl absolute top-10 left-8'>o</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-xl absolute top-[50] left-4'>x</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-3xl absolute top-[50%] left-14'>o</div>
            <div className='text-[#EB1751] bg-anim text-shadow text-xl absolute top-[45%] right-4'>x</div>


            <h1 className='text-[8em] text-shadow tracking-widest font-[samurai] leading-[0.9] font-bold text-yellow-500 '>T<span className='text-[#EB1751] F inline-block'>I</span>C</h1>
            <h1 className='text-[8em] text-shadow tracking-wide font-[samurai]  leading-[0.9] font-bold text-yellow-500'><span className='text-[#EB1751] B inline-block'>T</span>A<span className='text-[#EB1751] B inline-block'>C</span></h1>
            <h1 className='text-[8em] text-shadow tracking-wide font-[samurai]  leading-[0.9] font-bold text-yellow-500'>T<span className='text-[#EB1751] F inline-block'>O</span>E</h1>
        </>
    )
}

export default TicTacToeBanner
