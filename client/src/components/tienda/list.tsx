import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CreateStore from "./createStore"
import { listStoresRequest } from "../../api/storeRequests"
import ContextBody from "../../context"
//import EditStoreForm from "./editStore"

const Lists = () => {

    type storeType = {
        _id: string,
        storeImg: string,
        storeName: string,
        domicile: string
    }

    const {session} = useContext(ContextBody)
    const [stores, setStores] = useState<storeType[]>([])
    const [hideCreateStore, setHideCreateStore] = useState<boolean>(false)

    useEffect(() => {
        const listStoresFunc = async () => {
            console.log(session._id)
            const res = await listStoresRequest(session._id)
            setStores(res.data)
            console.log(res.data)
        }
        listStoresFunc()
    }, [session._id])
    
   console.log('sroes: ', stores)
    return(
        <>
        {!hideCreateStore && <div>
            <nav className="flex items-center justify-between">
                <button onClick={() => setHideCreateStore(true)} className="important-element flex items-center p-3 mb-3 font-medium cursor-pointer"><svg className="mr-2" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f8f8f8de"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#f8f8f8de" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Crear Tienda</button>
                <div className="bg-blue-500/20 text-blue-400 font-medium p-3 rounded-xl text-center">
                    <label className="text-2xl">Tiendas:</label>
                    <p className="text-xl">4</p>
                </div>
            </nav>
            <div className="flex flex-wrap">
                {stores.map((st) => 
                    <div key={st._id} className="bg-blue-500/10 w-[280px] mt-4 rounded-xl border-2 border-blue-900/50 mx-3 cursor-pointer">
                        <img className="rounded-t-xl" src={st.storeImg} alt=""></img>
                        <div className="p-4">
                            <h3 className="text-xl font-medium">{st.storeName}</h3>
                            <p className="mt-2">{st.domicile}</p>
                            <div className="flex justify-end mt-3">
                                <Link to={`/edit_store/${st._id}`} className="secondary-element py-2 px-3 font-medium mx-1">Editar</Link>
                                <Link className="important-element py-2 px-3 font-medium mx-1" to={`/store_resume/${st._id}`}>Ver</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>}
         {hideCreateStore && (<CreateStore setHideCreateStoreForm={setHideCreateStore} />)}
        </>
    )
}

export default Lists