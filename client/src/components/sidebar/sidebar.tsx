import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { Store, Package, Users, UserPlus, ClipboardList, ChevronDown, LogOut, Settings, CreditCard, Menu, X } from 'lucide-react'
import ContextBody from "../../context"

const Sidebar = () => {
    const { currentStore, session } = useContext(ContextBody)
    const [dropdownTienda, setDropdownTienda] = useState<boolean>(false)
    const [dropdownAdmin, setDropdownAdmin] = useState<boolean>(false)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

    // Detectar tamaño de pantalla y ajustar sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1400) {
                setSidebarOpen(false)
            } else {
                setSidebarOpen(true)
            }
        }

        // Ejecutar al montar
        handleResize()

        // Escuchar cambios de tamaño
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
session?.userRole === 'manager' 
    const menuItems = [
        {
            to: '/store_list',
            icon: Store,
            label: 'Tiendas',
            show: !currentStore
        },
        {
            to: `/products/${currentStore}`,
            icon: Package,
            label: 'Productos',
            show: !!currentStore
        },
        {
            to: `/get__store_cashiers/${currentStore}`,
            icon: Users,
            label: 'Cajeros',
            show: true
        },
        {
            to: `/cashiers_form/${currentStore}`,
            icon: UserPlus,
            label: 'Ingresar Cajero',
            show: !!currentStore
        },
        {
            to: `/clients_list/${currentStore}`,
            icon: ClipboardList,
            label: 'Clientes',
            show: session?.userRole === 'manager' 
        }
    ]


    const logoutFunc = async () => {
        await localStorage.removeItem("manager")
        await localStorage.removeItem("token")
        await localStorage.removeItem("role")
        await localStorage.removeItem("__paypal_storage__")
        window.location.href = '/login'
    }

    const handleCloseSidebar = () => {
        if (window.innerWidth < 1400) {
            setSidebarOpen(false)
        }
    }

    return (
        <>
            {/* Botón de Menú (Hamburger) */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
            >
                {sidebarOpen ? (
                    <X size={24} className="text-gray-100" />
                ) : (
                    <Menu size={24} className="text-gray-100" />
                )}
            </button>

            {/* Overlay para móvil */}
            {sidebarOpen && window.innerWidth < 1400 && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 h-screen bg-gray-900 border-r border-gray-800 transition-transform duration-300 w-64 overflow-y-auto z-40 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6 pt-20">
                    {/* Logo del Sistema */}
                    <div className="flex items-center justify-center mb-6 pb-6 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Store size={20} className="text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                NovaStore
                            </span>
                        </div>
                    </div>

                    {/* Dropdown de Tienda */}
                    <div className="mb-6">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownTienda(!dropdownTienda)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors border border-gray-700"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Store size={16} className="text-indigo-400 flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">
                                        {currentStore ? currentStore.storeName || 'Tienda Actual' : 'Tienda Principal'}
                                    </span>
                                </div>
                                <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${dropdownTienda ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownTienda && (
                                <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                                    <Link 
                                        to="/store_list" 
                                        className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownTienda(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        Ver todas las tiendas
                                    </Link>
                                    <Link 
                                        to="/" 
                                        className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownTienda(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        Configuración de Tienda
                                    </Link>
                                    <Link 
                                        to="/" 
                                        className="block px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownTienda(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        Métodos de Pago
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menú de Navegación */}
                    <nav className="space-y-2 mb-6">
                        {menuItems.map((item) => {
                            
                            const Icon = item.icon;
                            
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={handleCloseSidebar}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:bg-gray-800 hover:text-gray-200 group"
                                >
                                    <Icon size={20} className="group-hover:text-indigo-400 transition-colors" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Separador */}
                    <div className="border-t border-gray-800 my-4"></div>

                    {/* Dropdown de Usuario */}
                    {(session.email || session.username) && (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownAdmin(!dropdownAdmin)}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors border border-gray-700"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {session.username ? session.username.slice(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <span className="text-sm font-medium block truncate">
                                        {session.username || 'Usuario'}
                                    </span>
                                    <span className="text-xs text-gray-500 block truncate">
                                        {session.email}
                                    </span>
                                </div>
                                <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${dropdownAdmin ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {dropdownAdmin && (
                                <div className="absolute left-0 right-0 bottom-full mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                                    <Link 
                                        to="/" 
                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownAdmin(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        <Settings size={16} className="text-gray-400" />
                                        Mi Perfil
                                    </Link>
                                    <Link 
                                        to="/" 
                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownAdmin(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        <Settings size={16} className="text-gray-400" />
                                        Configuración
                                    </Link>
                                    <Link 
                                        to={`/connect_payment_method`} 
                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownAdmin(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        <CreditCard size={16} className="text-gray-400" />
                                        Cobros / Pagos
                                    </Link>
                                    <Link 
                                        to={`/subscription/${session._id}`} 
                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors text-sm"
                                        onClick={() => {
                                            setDropdownAdmin(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        <CreditCard size={16} className="text-gray-400" />
                                        Cambiar Plan
                                    </Link>
                                    <hr className="border-gray-700" />
                                    <button 
                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-750 transition-colors text-sm text-red-400 cursor-pointer"
                                        onClick={() => {
                                            logoutFunc()
                                            setDropdownAdmin(false)
                                            handleCloseSidebar()
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Spacer para el contenido principal (solo en desktop) */}
            {sidebarOpen && window.innerWidth >= 1400 && (
                <div className="w-64"></div>
            )}
        </>
    )
}

export default Sidebar




{
/*import { Link, useParams } from "react-router-dom"
import appPng from "../../assets/app-store.png"
import { useContext } from "react"
import ContextBody from "../../context"

const Sidebar = () => {
    const {currentStore} = useContext(ContextBody) 
    //debo disparar un context cuando le doy a "ver" en la lista de tiendas que dispare el controlador para traer la store en el 'context' 
    // y de ahi guardar los datos y que navegue a store_resume y ya queden los datos guardados de la tienda en el context para utilizarlos en el sidebar
    console.log('current store en sidebar: ', currentStore)
    return(
        <>
        <div className="secondary-background px-7 w-[250px]">
            <div className="w-full border-b-1 border-b-[#9ca3af] flex items-center justify-center h-[100px]">
                <img  src={appPng}></img>
            </div>
            <div className="mt-4">
                {currentStore ? '' : <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to="/store_list">Tiendas</Link></button>}
                {currentStore && <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/products/${currentStore}`}>Productos</Link></button> }
                <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/get__store_cashiers/${currentStore}`}>Cajeros</Link></button>
                {currentStore && <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/cashiers_form/${currentStore}`}>Ingresar Cajero</Link></button> }
                {/*currentStore && <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/get_all_cashiers/${currentStore}`}>Lista Cajas</Link></button> */}
                {/*currentStore?._id && <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/open_box/${currentStore?._id}`}>Abrir caja</Link></button> }
                <button className="list-a-button"><svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="none"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#9ca3af"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#9ca3af"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#9ca3af"></path> </g></svg><Link className="ml-2" to={`/clients_list/${currentStore}`}>Clientes</Link></button>
            </div>
            <button className="w-full">Logout</button>
        </div>
        </>
    )
}

export default Sidebar*/
}


