import { useEffect, useState } from "react"
import { getAllCashiersRequest } from "../../api/cashierRequests";
import { useParams } from "react-router-dom";
import { User, Calendar, CreditCard, Edit, Trash2, UserPlus, Search, Filter, MoreVertical } from 'lucide-react';




const getCashiers = () => {
  const { storeId } = useParams<{ storeId: string}>(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [cashiers, setCashiers] = useState([])

    useEffect(() => {
        const getCashiersFunc = async () => {
            const res = await getAllCashiersRequest({storeId})
            setCashiers(res.data)
        }
        getCashiersFunc()
    },[])
    console.log(cashiers)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRoleLabel = (role) => {
    const roles = {
      'cashier': { label: 'Cajero', color: 'bg-blue-500/20 text-blue-400' },
      'manager': { label: 'Gerente', color: 'bg-purple-500/20 text-purple-400' },
      'admin': { label: 'Administrador', color: 'bg-red-500/20 text-red-400' }
    };
    return roles[role] || { label: role, color: 'bg-gray-500/20 text-gray-400' };
  };

  const handleEdit = (cashierId) => {
    console.log('Editar cajero:', cashierId);
  };

  const handleDelete = (cashierId) => {
    console.log('Eliminar cajero:', cashierId);
  };

  // Filtrar cajeros
  const filteredCashiers = cashiers.filter(cashier => {
    const matchesSearch = cashier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cashier.userDni.toString().includes(searchTerm);
    const matchesRole = filterRole === 'all' || cashier.userRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const activeCashiers = cashiers.filter(c => c.isActive).length;
  //const totalTransactions = cashiers.reduce((sum, c) => sum + c.transactions, 0);
  //const totalSales = cashiers.reduce((sum, c) => sum + c.totalSales, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                <User className="text-indigo-500" size={36} />
                Gestión de Cajeros
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Administra tu equipo de cajeros y supervisa su desempeño
              </p>
            </div>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl p-4">
              <p className="text-blue-400 text-xs md:text-sm font-medium mb-1">Total Cajeros</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{cashiers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-4">
              <p className="text-green-400 text-xs md:text-sm font-medium mb-1">Activos</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{activeCashiers}</p>
            </div>
           {/* <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-4">
              <p className="text-purple-400 text-xs md:text-sm font-medium mb-1">Transacciones</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{totalTransactions.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-4">
              <p className="text-yellow-400 text-xs md:text-sm font-medium mb-1">Ventas Totales</p>
              <p className="text-xl md:text-2xl font-bold text-white">{formatCurrency(totalSales)}</p>
            </div>*/}
          </div>

          {/* Barra de Búsqueda y Filtros */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full md:w-48 bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <option value="all">Todos los roles</option>
                <option value="cashier">Cajeros</option>
                <option value="manager">Gerentes</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Cajeros */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {cashiers.map((cashier) => {
            const roleInfo = getRoleLabel(cashier.userRole);
            
            return (
              <div 
                key={cashier._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all hover:scale-[1.02] group"
              >
                {/* Header con Foto */}
                <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 pb-16">
                  <div className="flex justify-between items-start mb-4">
                    {/* Estado */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cashier.isActive 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {cashier.isActive ? '● En línea' : '○ Inactivo'}
                    </span>
                    
                    {/* Menú de opciones */}
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Foto de Perfil */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 shadow-xl">
                      {cashier.userPhoto ? (
                        <img 
                          src={cashier.userPhoto} 
                          alt={cashier.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={40} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 pt-14">
                  {/* Nombre y Rol */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {cashier.fullName}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>

                  {/* Información */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="text-gray-400">DNI:</span>
                      <span className="text-gray-200 font-semibold">
                        {cashier.userDni.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-400">Desde:</span>
                      <span className="text-gray-200 font-semibold">
                        {formatDate(cashier.UserDate)}
                      </span>
                    </div>
                  </div>

                  {/* Métricas */}
                 {/* <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ventas</p>
                      <p className="text-sm font-bold text-green-400">
                        {formatCurrency(cashier.totalSales)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Transacciones</p>
                      <p className="text-sm font-bold text-blue-400">
                        {cashier.transactions}
                      </p>
                    </div>
                  </div>*/}

                  {/* Botones de Acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cashier._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg font-medium transition-all border border-gray-700 hover:border-indigo-500"
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(cashier._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-all border border-red-600/30 hover:border-red-600/50"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado Vacío */}
        {filteredCashiers.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
              <User size={48} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No se encontraron cajeros</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterRole !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Comienza agregando tu primer cajero'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default getCashiers