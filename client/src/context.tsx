import {createContext, useEffect, useState } from "react"
import type { PropsWithChildren } from "react";
import { getStoreByIdRequest, listStoresRequest } from "./api/storeRequests";
import { loginCashierRequest } from "./api/cashierRequests";
import { useNavigate } from "react-router-dom";

const ContextBody = createContext({})

export const ContextBodyProvider = ({children}: PropsWithChildren) => {

    type storeType = {
        _id: string,
        storeImg: string,
        storeName: string,
        domicile: string
    }
    const navigate = useNavigate()
    const [session, setSession] = useState({})
    const [cashierSession, setCashierSession] = useState({})
    const [stores, setStores] = useState<storeType[]>([])
    const [currentStore, setCurrentStore] = useState([])

    useEffect(() => {
        const getSession = async () => {
            setSession(JSON.parse(localStorage.getItem('manager') || '{}'))
            setCurrentStore(sessionStorage.getItem('storeId') || '{}')
        }
        getSession()
    }, [])
    
    const listStoresFunc = async (sessionId) => {
        const res = await listStoresRequest(sessionId)
        setStores(res.data)
        console.log(res.data)
    }

    const getStoreByIdContext = async ({storeId}: string) => {
       const res = await getStoreByIdRequest({storeId})
       sessionStorage.setItem('storeId', res.data._id);
       setCurrentStore(sessionStorage.getItem('storeId'))
    }

    const loginCashierContext = async (userData) => {
        const res = await loginCashierRequest(userData)
        if(res.data.token.length > 0){
            sessionStorage.setItem('cashier', JSON.stringify(res.data));
            sessionStorage.setItem('cashierId', res.data.user._id);
            const cachierData = JSON.parse(sessionStorage.getItem('cashier'))
            setCashierSession(cachierData)
            navigate(`/store_resume/${res.data.user.storeId}`)
        }
    }
    
    return(
        <ContextBody.Provider value={{session, setSession, cashierSession, setCashierSession, stores, listStoresFunc, getStoreByIdContext, currentStore, loginCashierContext}}>
            {children}
        </ContextBody.Provider>
    )
}

export default ContextBody