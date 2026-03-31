import {createContext, useEffect, useState } from "react"
import type { PropsWithChildren } from "react";
import { getStoreByIdRequest, listStoresByCashierRequest, listStoresRequest } from "./api/storeRequests";
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
    const [message, setMessage] = useState(0)
    
    useEffect(() => {
        const getSession = async () => {
            setSession(JSON.parse(localStorage.getItem('manager') || '{}'))
            setCurrentStore(localStorage.getItem('storeId') || '{}')
            setCashierSession(localStorage.getItem('cashier') || '{}')
        }
        getSession()
    }, [])
    
    
    const listStoresFunc = async (sessionId) => {
        const session = JSON.parse(localStorage.getItem("manager") || "{}")

        if (session.userRole === "cashier") {
            const res = await listStoresByCashierRequest(sessionId)
            setStores(res.data)
            return;
        }
        const res = await listStoresRequest(sessionId)
        setStores(res.data)
        console.log(res.data)
    }

    const getStoreByIdContext = async ({storeId}: string) => {
       const res = await getStoreByIdRequest({storeId})
       localStorage.setItem('storeId', res.data._id);
       setCurrentStore(localStorage.getItem('storeId'))
    }

    const loginCashierContext = async (userData) => {
        const res = await loginCashierRequest(userData)
        console.log(res.data.token)
        if(res.data.token !== 0){
            localStorage.setItem('cashier', JSON.stringify(res.data));
            localStorage.setItem('cashierId', res.data.user._id);
            const cachierData = JSON.parse(localStorage.getItem('cashier'))
            setCashierSession(cachierData)
            navigate(`/store_resume/${res.data.user.storeId}`)
        }else{
            return 1
        }
    }
    
    return(
        <ContextBody.Provider value={{session, setSession, cashierSession, setCashierSession, stores, message, setMessage, listStoresFunc, getStoreByIdContext, currentStore, loginCashierContext}}>
            {children}
        </ContextBody.Provider>
    )
}

export default ContextBody