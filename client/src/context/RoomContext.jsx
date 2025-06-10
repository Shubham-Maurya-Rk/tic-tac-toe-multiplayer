import React, { useState } from 'react'

export const RoomDataContext = React.createContext();
const RoomContext = ({children}) => {
    const [room, setroom] = useState({
        _id: "",
        players: {
            x: "",
            o: ""
        },
        status: "",
        board: [[null,'x',null],[null,'0',null],[null,null,null]],
        turn: "x"
    })
    return (
        <RoomDataContext.Provider value={{room, setroom}}>
            {children}
        </RoomDataContext.Provider>
    )
}

export default RoomContext
