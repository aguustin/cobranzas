import {createContext, useEffect, useState } from "react"
import type { PropsWithChildren } from "react";

const ContextBody = createContext({})

export const ContextBodyProvider = ({children}: PropsWithChildren) => {
    const [session, setSession] = useState({})

    useEffect(() => {
        const getSession = async () => {
            setSession(JSON.parse(localStorage.getItem('manager') || '{}'))
        }
        getSession()
    }, [])

    return(
        <ContextBody.Provider value={{session, setSession}}>
            {children}
        </ContextBody.Provider>
    )
}

export default ContextBody