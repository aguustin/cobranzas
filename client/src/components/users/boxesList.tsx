import { User, LogIn, Clock, CheckCircle, XCircle } from 'lucide-react';

const BoxesList = () => {
  // Datos de ejemplo
  const cajas = [
    { id: 1, numero: 'CAJA-001', usuario: 'Juan Pérez', activa: true, fecha: '2026-02-02', hora: '14:30:45' },
    { id: 2, numero: 'CAJA-002', usuario: 'María García', activa: true, fecha: '2026-02-02', hora: '09:15:20' },
    { id: 3, numero: 'CAJA-003', usuario: null, activa: false, fecha: null, hora: null },
    { id: 4, numero: 'CAJA-004', usuario: 'Carlos López', activa: true, fecha: '2026-02-02', hora: '11:45:10' },
    { id: 5, numero: 'CAJA-005', usuario: null, activa: false, fecha: null, hora: null },
    { id: 6, numero: 'CAJA-006', usuario: null, activa: false, fecha: null, hora: null },
  ];

  const cajasActivas = cajas.filter(c => c.activa);
  const cajasInactivas = cajas.filter(c => !c.activa);

  const ingresarCaja = (numeroCaja) => {
    console.log('Ingresando a:', numeroCaja);
    alert(`Ingresando a ${numeroCaja}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Estado de Cajas</h1>

        {/* Cajas Activas */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="text-green-400" size={28} />
            <h2 className="text-2xl font-bold">Cajas Activas</h2>
            <span className="ml-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
              {cajasActivas.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cajasActivas.map((caja) => (
              <div 
                key={caja.id}
                className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-400">{caja.numero}</span>
                  <div className="px-3 py-1 bg-green-500/30 rounded-full">
                    <span className="text-green-400 text-xs font-semibold">EN USO</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-300 text-sm">{caja.usuario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">{caja.fecha} - {caja.hora}</span>
                  </div>
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
              {cajasInactivas.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cajasInactivas.map((caja) => (
              <div 
                key={caja.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-300">{caja.numero}</span>
                  <div className="px-3 py-1 bg-gray-700/50 rounded-full">
                    <span className="text-gray-400 text-xs font-semibold">LIBRE</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Sin usuario asignado</p>
                </div>

                <button 
                  onClick={() => ingresarCaja(caja.numero)}
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
    </div>
  );
}

export default BoxesList;