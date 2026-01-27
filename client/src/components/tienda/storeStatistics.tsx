import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Package, AlertCircle, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useParams } from 'react-router-dom';
import { getAllStatisticsRequest } from '../../api/storeRequests';

export const StoreStatistics = () => {

 const { storeId, storeName } = useParams<{ storeId: string, storeName: string}>();

    type DailySellData = {
        id: string;
        cantidad: number;
        productos: number;
        ventas: number;
    }

    const [timeFilter, setTimeFilter] = useState('dia');
    const [sellsData, setSellsData] = useState<DailySellData | null>(null);
    //const [sellsData, setsellsData] = useState<BoxType | null>(null);
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    const [selectedMetrics, setSelectedMetrics] = useState({
        ventas: true,
        cantidad: true,
        productos: true,
        efectivo: true,
        diferencia: true
    });

    
    useEffect(() => {
     const getAllStatisticsFunc = async () => {
         const params: any = { filter: timeFilter };
         
         if (customStart && customEnd) {
             params.start = customStart;
             params.end = customEnd;
         }
 
         const query = {
          storeId: storeId,
          filter: params.filter,
          start: params.start,
          end: params.end
         } ;
         console.log(storeId, ' ', query)
         const res = await getAllStatisticsRequest(query);
         setSellsData(res.data);
     };
        getAllStatisticsFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeId, timeFilter])

    console.log(sellsData)

 const chartDataByFilter = sellsData || [];

    const getFilteredData = () => {
    return chartDataByFilter.map(item => {
        const filteredItem: any = { time: item.time };
        if (selectedMetrics.ventas) filteredItem.ventas = item.ventas;
        if (selectedMetrics.cantidad) filteredItem.cantidad = item.cantidad;
        if (selectedMetrics.productos) filteredItem.productos = item.productos;
        if (selectedMetrics.efectivo) filteredItem.efectivo = item.efectivo;
        return filteredItem;
    });
    };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="text-indigo-500" size={36} />
            Estadísticas de Ventas
          </h1>
          <p className="text-gray-400">Análisis detallado del rendimiento de {storeName}</p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-400" size={20} />
              <span className="text-gray-400 font-medium">Período:</span>
            <input
                type="datetime-local"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
            />
            <input
                type="datetime-local"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100"
            />
            <select onChange={(e) => setTimeFilter(e.target.value)}>
                <option value={'siempre'}>por fechas</option>
                <option value={'dia'}>dia</option>
                <option value={'semana'}>semana</option>
                <option value={'mes'}>mes</option>
                <option value={'anio'}>año</option>
                <option value={'siempre'}>siempre</option>
            </select>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="text-indigo-400" size={20} />
              <span className="text-gray-400 font-medium">Métricas:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleMetric('ventas')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedMetrics.ventas
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  Ventas
                </button>
                <button
                  onClick={() => toggleMetric('cantidad')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedMetrics.cantidad
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  Cantidad
                </button>
                <button
                  onClick={() => toggleMetric('productos')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedMetrics.productos
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  Productos
                </button>
                <button
                  onClick={() => toggleMetric('efectivo')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedMetrics.efectivo
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  Efectivo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total de Ventas */}
          <div 
            onClick={() => toggleMetric('ventas')}
            className={`cursor-pointer bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border rounded-xl p-6 shadow-xl hover:shadow-indigo-500/20 transition-all ${
              selectedMetrics.ventas ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-indigo-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <DollarSign size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Vendido</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(sellsData?.productos)}</p>
          </div>

          {/* Cantidad de Ventas */}
          <div 
            onClick={() => toggleMetric('cantidad')}
            className={`cursor-pointer bg-gradient-to-br from-purple-900/40 to-purple-800/20 border rounded-xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all ${
              selectedMetrics.cantidad ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-purple-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-xl">
                <ShoppingBag size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Cantidad de Ventas</h3>
            <p className="text-3xl font-bold text-white">{sellsData?.cantidad}</p>
          </div>

          {/* Subtotal Ganado */}
          <div 
            onClick={() => toggleMetric('productos')}
            className={`cursor-pointer bg-gradient-to-br from-green-900/40 to-green-800/20 border rounded-xl p-6 shadow-xl hover:shadow-green-500/20 transition-all ${
              selectedMetrics.productos ? 'border-green-500 ring-2 ring-green-500/50' : 'border-green-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Package size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Subtotal Ganado</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(sellsData?.ventas)}</p>
          </div>

          {/* Diferencia de Caja */}
          <div 
            onClick={() => toggleMetric('diferencia')}
            className={`cursor-pointer bg-gradient-to-br ${
              sellsData?.diferencia === 0 
                ? 'from-gray-900/40 to-gray-800/20' 
                : sellsData?.diferencia > 0 
                  ? 'from-green-900/40 to-green-800/20' 
                  : 'from-red-900/40 to-red-800/20'
            } border rounded-xl p-6 shadow-xl transition-all ${
              selectedMetrics.diferencia 
                ? sellsData?.diferencia === 0 
                  ? 'border-gray-500 ring-2 ring-gray-500/50' 
                  : sellsData?.diferencia > 0 
                    ? 'border-green-500 ring-2 ring-green-500/50' 
                    : 'border-red-500 ring-2 ring-red-500/50'
                : sellsData?.diferencia === 0 
                  ? 'border-gray-700/30' 
                  : sellsData?.diferencia > 0 
                    ? 'border-green-700/30' 
                    : 'border-red-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                sellsData?.diferencia === 0 
                  ? 'bg-gray-600' 
                  : sellsData?.diferencia > 0 
                    ? 'bg-green-600' 
                    : 'bg-red-600'
              }`}>
                <AlertCircle size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Diferencia de Caja</h3>
            <p className={`text-3xl font-bold ${
              sellsData?.diferencia === 0 
                ? 'text-white' 
                : sellsData?.diferencia > 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
            }`}>
              {sellsData?.diferencia === 0 
                ? 'Sin diferencia' 
                : formatCurrency(Math.abs(sellsData?.diferencia))}
            </p>
          </div>
        </div>

        {/* Gráfico de Líneas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-400" size={24} />
            Evolución de Métricas
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={getFilteredData()}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCantidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProductos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEfectivo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              {selectedMetrics.ventas && (
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fill="url(#colorVentas)"
                  name="Ventas"
                />
              )}
              {selectedMetrics.cantidad && (
                <Area 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  fill="url(#colorCantidad)"
                  name="Cantidad"
                />
              )}
              {selectedMetrics.productos && (
                <Area 
                  type="monotone" 
                  dataKey="productos" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fill="url(#colorProductos)"
                  name="Productos"
                />
              )}
              {selectedMetrics.efectivo && (
                <Area 
                  type="monotone" 
                  dataKey="efectivo" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  fill="url(#colorEfectivo)"
                  name="Efectivo"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras Comparativo */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShoppingBag className="text-purple-400" size={24} />
            Comparativa por Período
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              {selectedMetrics.ventas && <Bar dataKey="ventas" fill="#6366f1" name="Ventas" />}
              {selectedMetrics.cantidad && <Bar dataKey="cantidad" fill="#a855f7" name="Cantidad" />}
              {selectedMetrics.productos && <Bar dataKey="productos" fill="#22c55e" name="Productos" />}
              {selectedMetrics.efectivo && <Bar dataKey="efectivo" fill="#eab308" name="Efectivo" />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StoreStatistics