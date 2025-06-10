import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { RoomDataContext } from '../context/RoomContext';
const Suggestion = ({ setshowSuggestion }) => {
    const { room } = useContext(RoomDataContext);
    const [index, setindex] = useState(null)
    const getIdx = (r, c) => r * 3 + c;
    const suggestMove = async (board, player) => {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/best-move`, {
            board: room.board,
            player: room.turn
        });
        const bestMove = getIdx(res.data.move.r, res.data.move.c);
        setindex(bestMove);
        const timer = setTimeout(() => setshowSuggestion(false), 2000);
        return () => clearTimeout(timer);
    };


    useEffect(() => {
        suggestMove();
    }, [])
    return (
        <div className='bg-yellow-500 p-1 gap-2 rounded-lg fixed right-[8%] top-[8%] z-50'>
            <div className='grid grid-cols-3 gap-1'>
                {[...Array(9)].map((_, idx) => (
                    <div key={idx} className={`w-full p-2 h-full bg-${index === idx ? '[#EB1751]' : 'white'} rounded-sm cursor-pointer`}></div>
                ))}
            </div>
        </div>
    )
}

export default Suggestion
