import { useState } from "react"
import pruebaJpg from '../../assets/prueba.jpg'
import { Link } from "react-router-dom"
import CreateStore from "./createStore"

const Lists = () => {
    const [hideCreateStore, setHideCreateStore] = useState<boolean>(false)

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
                <div className="bg-blue-500/10 w-[280px] mt-4 rounded-xl border-2 border-blue-900/50 mx-3">
                    <img className="rounded-t-xl" src={pruebaJpg} alt=""></img>
                    <div className="p-4">
                        <h3 className="text-xl font-medium">Tienda numero 1</h3>
                        <p className="mt-2">Direccion: Pedro B. palacios y San Martin 203</p>
                        <div className="flex justify-end mt-3">
                            <button className="secondary-element py-2 px-3 font-medium mx-1 ">Editar</button>
                            <Link className="important-element py-2 px-3 font-medium mx-1" to="/">Ver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
         {hideCreateStore && (<CreateStore setHideCreateProduct={setHideCreateStore} />)}
        </>
    )
}

export default Lists