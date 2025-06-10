import React, { useState } from 'react'


export const UserDataContext = React.createContext();
const UserContext = ({ children }) => {
    const [user, setuser] = useState({
        name: "",
        email: ""
    })
    return (
        <>
            <UserDataContext.Provider value={{ user, setuser }}>
                {children}
            </UserDataContext.Provider>
        </>
    )
}

export default UserContext
