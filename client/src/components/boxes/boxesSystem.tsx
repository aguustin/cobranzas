import { useState } from 'react';
import CreateBox from './createBox';
import BoxesList from './boxesList';

const Boxes = () => {
  // Datos de ejemplo
  const [vista, setVista] = useState<number>(1)

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="absolute top-0 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setVista(1)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            vista === 1 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          Lista cajas
        </button>
        <button 
          onClick={() => setVista(2)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            vista === 2 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          Registrar caja
        </button>
      </div>
      {vista === 1 && <BoxesList/>}
      {vista === 2 && <CreateBox/>}
    </div>
  );
}

export default Boxes;