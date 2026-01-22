import { useState, useEffect } from 'react';
import { Store, Clock, DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, Check, X } from 'lucide-react';
import { getStoreBoxRequest, getStoreRequest } from '../../api/storeRequests';
import { useParams } from 'react-router-dom';

export const StoreResume = () => {
  const { storeId } = useParams<{ storeId: string}>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [storeData, setStoreData] = useState<[]>();
  const [boxData, setBoxData] = useState<[]>();

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

    useEffect(() => {
    const getStoreFunc = async () => {
        const res = await getStoreRequest({storeId})
        setStoreData(res.data)

        const resB = await getStoreBoxRequest({storeId})
        setBoxData(resB.data)
     }
     getStoreFunc()
  }, [])

  // Datos de ejemplo
  const tiendaData = {
    nombre: "Tienda Principal",
    sucursal: "SUC-001",
    estado: "abierta", // abierta, cerrada
    cajaEstado: "abierta", // abierta, cerrada
    turno: "Mañana", // Mañana, Tarde, Noche
    ventas: {
      total: 45678.50,
      cantidad: 127,
      clientes: 89,
      productos: 342,
      efectivo: 28450.00,
      diferencia: -125.50 // Negativo = faltante, Positivo = sobrante
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Sticky - Información de la Tienda */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl shadow-2xl mb-8 overflow-hidden">
          <div className="p-6">
            {/* Fila Principal */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              {/* Nombre y Sucursal */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-950 rounded-xl">
                  <Store size={26} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{tiendaData.nombre}</h1>
                  <p className="text-gray-400 text-sm">Sucursal: <span className="text-indigo-400 font-semibold">{tiendaData.sucursal}</span></p>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Clock size={18} className="text-indigo-400" />
                  <span className="text-2xl font-bold font-mono">{formatTime(currentTime)}</span>
                </div>
                <p className="text-gray-400 text-sm capitalize">{formatDate(currentTime)}</p>
              </div>
            </div>

            {/* Estados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Estado Tienda */}
              <div className={`p-3 rounded-lg border-2 ${
                tiendaData.estado === 'abierta' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Estado Tienda</span>
                  {tiendaData.estado === 'abierta' ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <X size={18} className="text-red-400" />
                  )}
                </div>
                <p className={`font-bold mt-1 ${
                  tiendaData.estado === 'abierta' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tiendaData.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
                </p>
              </div>

              {/* Estado Caja */}
              <div className={`p-3 rounded-lg border-2 ${
                tiendaData.cajaEstado === 'abierta' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Caja</span>
                  {tiendaData.cajaEstado === 'abierta' ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <X size={18} className="text-red-400" />
                  )}
                </div>
                <p className={`font-bold mt-1 ${
                  tiendaData.cajaEstado === 'abierta' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tiendaData.cajaEstado === 'abierta' ? 'Abierta' : 'Cerrada'}
                </p>
              </div>

              {/* Turno Activo */}
              <div className="p-3 rounded-lg border-2 bg-blue-500/10 border-blue-500/30">
                <span className="text-sm text-gray-400 block">Turno Activo</span>
                <p className="font-bold text-blue-400 mt-1">{tiendaData.turno}</p>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all">
                  Abrir Caja
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-semibold transition-all border border-gray-700">
                  Cerrar Turno
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas del Día */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={28} />
            Resumen del Día
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Ventas del Día */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-700/30 rounded-xl p-6 shadow-xl hover:shadow-indigo-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl">
                  <DollarSign size={24} />
                </div>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/20 px-3 py-1 rounded-full">HOY</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Ventas del Día</h3>
              <p className="text-3xl font-bold text-white mb-2">{formatCurrency(tiendaData.ventas.total)}</p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <TrendingUp size={16} />
                <span>+12.5% vs ayer</span>
              </div>
            </div>

            {/* Cantidad de Ventas */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-6 shadow-xl hover:shadow-purple-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl">
                  <ShoppingBag size={24} />
                </div>
                <span className="text-xs text-purple-400 font-semibold bg-purple-500/20 px-3 py-1 rounded-full">TRANSACCIONES</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Cantidad de Ventas</h3>
              <p className="text-3xl font-bold text-white mb-2">{tiendaData.ventas.cantidad}</p>
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <span>Ticket promedio: {formatCurrency(tiendaData.ventas.total / tiendaData.ventas.cantidad)}</span>
              </div>
            </div>

            {/* Clientes Atendidos */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                  <Users size={24} />
                </div>
                <span className="text-xs text-blue-400 font-semibold bg-blue-500/20 px-3 py-1 rounded-full">PERSONAS</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Clientes Atendidos</h3>
              <p className="text-3xl font-bold text-white mb-2">{tiendaData.ventas.clientes}</p>
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <span>{((tiendaData.ventas.clientes / tiendaData.ventas.cantidad) * 100).toFixed(1)}% tasa de conversión</span>
              </div>
            </div>

            {/* Productos Vendidos */}
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-6 shadow-xl hover:shadow-green-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
                  <ShoppingBag size={24} />
                </div>
                <span className="text-xs text-green-400 font-semibold bg-green-500/20 px-3 py-1 rounded-full">UNIDADES</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Productos Vendidos</h3>
              <p className="text-3xl font-bold text-white mb-2">{tiendaData.ventas.productos}</p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <span>{(tiendaData.ventas.productos / tiendaData.ventas.cantidad).toFixed(1)} productos por venta</span>
              </div>
            </div>

            {/* Efectivo en Caja */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-6 shadow-xl hover:shadow-yellow-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl">
                  <DollarSign size={24} />
                </div>
                <span className="text-xs text-yellow-400 font-semibold bg-yellow-500/20 px-3 py-1 rounded-full">EFECTIVO</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Efectivo en Caja</h3>
              <p className="text-3xl font-bold text-white mb-2">{formatCurrency(tiendaData.ventas.efectivo)}</p>
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>{((tiendaData.ventas.efectivo / tiendaData.ventas.total) * 100).toFixed(1)}% del total</span>
              </div>
            </div>

            {/* Diferencia de Caja */}
            <div className={`bg-gradient-to-br ${
              tiendaData.ventas.diferencia === 0 
                ? 'from-gray-900/40 to-gray-800/20 border-gray-700/30' 
                : tiendaData.ventas.diferencia > 0 
                  ? 'from-green-900/40 to-green-800/20 border-green-700/30' 
                  : 'from-red-900/40 to-red-800/20 border-red-700/30'
            } border rounded-xl p-6 shadow-xl transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  tiendaData.ventas.diferencia === 0 
                    ? 'bg-gray-600' 
                    : tiendaData.ventas.diferencia > 0 
                      ? 'bg-green-600' 
                      : 'bg-red-600'
                }`}>
                  <AlertCircle size={24} />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  tiendaData.ventas.diferencia === 0 
                    ? 'text-gray-400 bg-gray-500/20' 
                    : tiendaData.ventas.diferencia > 0 
                      ? 'text-green-400 bg-green-500/20' 
                      : 'text-red-400 bg-red-500/20'
                }`}>
                  {tiendaData.ventas.diferencia === 0 
                    ? 'OK' 
                    : tiendaData.ventas.diferencia > 0 
                      ? 'SOBRANTE' 
                      : 'FALTANTE'}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Diferencia de Caja</h3>
              <p className={`text-3xl font-bold mb-2 ${
                tiendaData.ventas.diferencia === 0 
                  ? 'text-white' 
                  : tiendaData.ventas.diferencia > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
              }`}>
                {tiendaData.ventas.diferencia === 0 
                  ? 'Sin diferencia' 
                  : formatCurrency(Math.abs(tiendaData.ventas.diferencia))}
              </p>
              <div className={`flex items-center gap-2 text-sm ${
                tiendaData.ventas.diferencia === 0 
                  ? 'text-gray-400' 
                  : tiendaData.ventas.diferencia > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
              }`}>
                <span>
                  {tiendaData.ventas.diferencia === 0 
                    ? 'Caja cuadrada' 
                    : tiendaData.ventas.diferencia > 0 
                      ? 'Hay dinero extra en caja' 
                      : 'Falta dinero en caja'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all ">
            Nueva Venta
          </button>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all ">
            Ver Ventas del Día
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
            Arqueo de Caja
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all border border-gray-700">
            Exportar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreResume