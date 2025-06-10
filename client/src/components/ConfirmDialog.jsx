import React from 'react'

const ConfirmDialog = ({text,onYes,onNo}) => {
    return (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 w-11/12 z-50 border-yellow-200 border-4 rounded-2xl text-center p-5'>
            <h1 className='text-xl font-bold text-[#321d80] font-[samurai]'>{text}</h1>
            <div className='flex justify-center gap-5 mt-5'>
                <button onClick={onYes} className='bg-[#EB1751] text-white font-bold py-3 px-5 rounded-2xl'>Yes</button>
                <button onClick={onNo} className='bg-[#EB1751] text-white font-bold py-3 px-5 rounded-2xl'>No</button>
            </div>
        </div>
    )
}

export default ConfirmDialog
