import { User, LogIn, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBoxesListRequest, openCloseBoxRequest } from '../../api/boxRequests';
import { formatDateTime } from '../../globalComp';

const BoxesList = () => {
  const {storeId} = useParams<{ storeId: string}>();
  const [boxesData, setBoxesData] = useState([])
  
  let cashierId = sessionStorage.getItem('cashierId');

  useEffect(() => {
   // espera hasta que haya sesión

  const getBoxesList = async () => {
    const res = await getBoxesListRequest({storeId});
    setBoxesData(res.data);
  };

  getBoxesList();
}, [storeId]);
 
  console.log('boxes: ',  boxesData)

  const ingresarCaja = async (boxId, isOpen) => {
    const data = {
      boxId: boxId,
      isOpen: isOpen,
      cashierId: cashierId
    }
    await openCloseBoxRequest(data)
    window.location.reload()
  }

  return(
    <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Estado de Cajas</h1>
        {/* Cajas Activas */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="text-green-400" size={28} />
            <h2 className="text-2xl font-bold">Cajas Activas</h2>
            <span className="ml-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
               {boxesData.filter(caja => caja.isOpen).length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {boxesData
  .filter(caja => caja.isOpen)
  .map(caja => (
    <div 
      key={caja._id}
      className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-green-400">
          {caja.boxNumber}
        </span>
        <div className="px-3 py-1 bg-green-500/30 rounded-full">
          <span className="text-green-400 text-xs font-semibold">
            EN USO
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="text-gray-300 text-sm">{caja?.boxName} - {caja?.cashier?.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-gray-400 text-sm">
            {formatDateTime(caja?.cashier?.loginDate)}
          </span>
        </div>
        <div className="items-center justify-between gap-2">
            <span className="flex items-center text-gray-400 text-sm mb-2">
            <DollarSign size={16} className="text-gray-400" />
            <p className='font-medium'>Dinero Inicial: {caja?.initialCash}</p>
          </span>
          <span className="flex items-center text-gray-400 text-sm">
            <DollarSign size={16} className="text-green-600" />
            <p className='text-green-600 font-medium'>Dinero En Caja: {caja?.totalMoneyInBox}</p>
          </span>
        </div>
          <button onClick={() => ingresarCaja(caja?._id, false)}  className="flex items-center justify-center gap-2 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow-lg cursor-pointer">
                Cerrar Caja
          </button>
      </div>
    </div>
))}

          </div>
        </div>
        
        {/* Cajas Inactivas */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <XCircle className="text-gray-400" size={28} />
            <h2 className="text-2xl font-bold">Cajas Disponibles</h2>
            <span className="ml-2 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-semibold">
              {boxesData.filter(caja => !caja?.isOpen).length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {boxesData
  .filter(caja => !caja?.isOpen)
  .map(caja => (
    <div 
      key={caja._id}
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl hover:border-indigo-500/50 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-gray-300">
          {caja?.boxNumber}
        </span>
        <div className="px-3 py-1 bg-gray-700/50 rounded-full">
          <span className="text-gray-400 text-xs font-semibold">
            LIBRE
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-sm">Sin usuario asignado</p>
      </div>

      <button 
        onClick={() => ingresarCaja(caja?._id, true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
      >
        <LogIn size={18} />
        Ingresar a Caja
      </button>
    </div>
))}

          </div>
        </div>
      </div>
  )
}

export default BoxesList