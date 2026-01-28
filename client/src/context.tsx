import {createContext, useEffect, useState } from "react"
import type { PropsWithChildren } from "react";
import { listStoresRequest } from "./api/storeRequests";

const ContextBody = createContext({})

export const ContextBodyProvider = ({children}: PropsWithChildren) => {

     type storeType = {
        _id: string,
        storeImg: string,
        storeName: string,
        domicile: string
    }

    const [session, setSession] = useState({})
     const [stores, setStores] = useState<storeType[]>([])

    useEffect(() => {
        const getSession = async () => {
            setSession(JSON.parse(localStorage.getItem('manager') || '{}'))
        }
        getSession()
    }, [])

    
    const listStoresFunc = async (sessionId) => {
        const res = await listStoresRequest(sessionId)
        setStores(res.data)
        console.log(res.data)
    }

    return(
        <ContextBody.Provider value={{session, setSession, stores, listStoresFunc}}>
            {children}
        </ContextBody.Provider>
    )
}

export default ContextBody