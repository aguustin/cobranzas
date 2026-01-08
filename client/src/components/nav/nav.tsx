import { useState } from "react";
import { ChevronDown} from 'lucide-react';
import { Link } from "react-router-dom";

const Nav = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownTienda, setDropdownTienda] = useState(false)
    const [dropdownAdmin, setDropdownAdmin] = useState(false)

    return(
        <>
        <div>
            <nav className="secondary-background  p-5">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}>menu</button>
                        <h3 className="title title-font-a flex items-center ml-3"><svg height="40" width="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 3.75V6H2.75C2.33579 6 2 6.33579 2 6.75V18.25C2 19.7688 3.23122 21 4.75 21H19.25C20.7688 21 22 19.7688 22 18.25V6.75C22 6.33579 21.6642 6 21.25 6H16V3.75C16 2.7835 15.2165 2 14.25 2H9.75C8.7835 2 8 2.7835 8 3.75ZM9.75 3.5H14.25C14.3881 3.5 14.5 3.61193 14.5 3.75V6H9.5V3.75C9.5 3.61193 9.61193 3.5 9.75 3.5ZM8 13V9.5H11.5V13H8ZM8 17.5V14H11.5V17.5H8ZM16 13H12.5V9.5H16V13ZM12.5 17.5V14H16V17.5H12.5Z" fill="#7c3aed"></path> </g></svg>
                            NovaStore
                        </h3>
                    </div>
                    <div className="flex items-center max-w-[800px] justify-end">
                        <input className="bg-gray-700 border-gray-500 w-[400px] p-2 rounded-xl" type="text" name="searchProduct" placeholder="search"></input>
                         <div className="relative">
                            <button
                                onClick={() => setDropdownTienda(!dropdownTienda)}
                                className="flex items-center ml-3 mr-3 gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-750 rounded-lg transition-colors border border-gray-700"
                            >
                                <span className="text-sm font-medium">Tienda Principal</span>
                                <ChevronDown size={16} className={`transition-transform ${dropdownTienda ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownTienda && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                    Configuración de Tienda
                                </Link>
                                <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                    Métodos de Pago
                                </Link>
                                <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                    Envíos y Entregas
                                </Link>
                                </div>
                            )}
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownAdmin(!dropdownAdmin)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-750 rounded-lg transition-colors border border-gray-700"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                                    JD
                                    </div>
                                    <span className=" text-sm font-medium">Juan Díaz</span>
                                    <ChevronDown size={16} className={`transition-transform ${dropdownAdmin ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdownAdmin && (
                                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                    <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                        Mi Perfil
                                    </Link>
                                    <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                        Configuración de Cuenta
                                    </Link>
                                    <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm">
                                        Seguridad
                                    </Link>
                                    <hr className="border-gray-700" />
                                    <Link to="/" className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm text-red-400">
                                        Cerrar Sesión
                                    </Link>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>
            </nav>
        </div>
        </>
    )
}

export default Nav