import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CreateStore from "./createStore"
import ContextBody from "../../context"
import { Plus, Store, MapPin, Edit, Eye, TrendingUp } from 'lucide-react';
//import EditStoreForm from "./editStore"

const Lists = () => {

    const {session, stores, listStoresFunc} = useContext(ContextBody)
    const [hideCreateStoreForm, setHideCreateStoreForm] = useState<boolean>(false)

    useEffect(() => {
        console.log(stores)
        listStoresFunc(session._id)
    }, [session._id])
    
 const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (hideCreateStoreForm) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setHideCreateStoreForm(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/50 hover:bg-indigo-700/50 text-white rounded-lg font-medium transition-all mb-6"
          >
            ← Volver a Lista
          </button>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              
                  <CreateStore setHideCreateStoreForm={setHideCreateStoreForm} />
              
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Store className="text-indigo-500" size={36} />
              Mis Tiendas
            </h1>
            <p className="text-gray-400">Gestiona todas tus sucursales desde un solo lugar</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Contador de Tiendas */}
            <div className="flex items-center bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl px-6 py-3 text-center min-w-[140px]">
              <p className="text-blue-400 text-sm font-medium ">Total Tiendas: </p>
              <p className="text-xl font-bold text-white ml-1">{stores.length}</p>
            </div>

            {/* Botón Crear Tienda */}
            <button 
              onClick={() => setHideCreateStoreForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
            >
              <Plus size={20} />
              Crear Tienda
            </button>
          </div>
        </div>

        {/* Grid de Tiendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div 
              key={store._id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all hover:scale-[1.02] group"
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={store.storeImg} 
                  alt={store.storeName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Badge de Estado */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    store.active 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {store.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5">
                {/* Nombre */}
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                  {store.storeName}
                </h3>

                {/* Domicilio */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400 text-sm line-clamp-2">{store.domicile}</p>
                </div>

                {/* Métricas */}
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Ventas Totales</span>
                    <span className="text-green-400 font-bold text-sm">
                      {formatCurrency(store.storeTotalEarned)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Crecimiento Mensual</span>
                    <span className={`font-semibold text-sm flex items-center gap-1 ${
                      store.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp size={14} className={store.monthlyGrowth < 0 ? 'rotate-180' : ''} />
                      {store.monthlyGrowth >= 0 ? '+' : ''}{store.monthlyGrowth}%
                    </span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-2">
                  <Link to={`/edit_store/${store._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg font-medium transition-all border border-gray-700 hover:border-indigo-500"
                  >
                    <Edit size={16} />
                    Editar
                  </Link>
                  <Link to={`/store_resume/${store._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Eye size={16} />
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vacío */}
        {stores.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
              <Store size={48} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No hay tiendas registradas</h3>
            <p className="text-gray-500 mb-6">Comienza creando tu primera tienda</p>
            <button 
              onClick={() => setHideCreateStoreForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus size={20} />
              Crear Primera Tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lists