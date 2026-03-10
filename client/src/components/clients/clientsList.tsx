import { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, ShoppingBag, DollarSign, Gift, Edit, Trash2, UserPlus, TrendingUp, CheckCircle, XCircle, BadgeMinus, BadgePlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getAllClients, unsubClientRequest } from '../../api/clientRequests';

const ClientList = () => {
  const { storeId } = useParams<{ storeId: string}>(); 
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('totalSpent'); // 'totalSpent', 'clientProductQuantity', 'clientName'

  // Fetch de clientes desde el backend
  useEffect(() => {
      fetchClients();
      console.log(clients)
    }, []);
    
    const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await getAllClients(storeId);
      console.log(res.data)
      setClients(res.data);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    } finally {
        setLoading(false);
    }
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPhone = (phone) => {
    const phoneStr = phone.toString();
    return phoneStr.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  // Filtrar y ordenar clientes
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = 
        client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.toString().includes(searchTerm);
      
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && client.active) ||
        (filterStatus === 'inactive' && !client.active);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'clientProductQuantity') return b.clientProductQuantity - a.clientProductQuantity;
      if (sortBy === 'clientName') return a.clientName.localeCompare(b.clientName);
      return 0;
    });

  // Calcular estadísticas
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.active).length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
    totalGiftCards: clients.reduce((sum, c) => sum + (c.giftCard || 0), 0)
  };

  const handleEdit = (clientId) => {
    console.log('Editar cliente:', clientId);
  };

  const handleSub = async (clientId) => {
    console.log(clientId)
    await unsubClientRequest({clientId})
    setClients((prevClients) =>
        prevClients.map((client) =>
        client._id === clientId
            ? { ...client, active: !client.active }
            : client
        )
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                <Users className="text-indigo-500" size={36} />
                Gestión de Clientes
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Administra tu base de clientes y analiza su comportamiento
              </p>
            </div>
            {
            /*
              <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto">
                <UserPlus size={20} />
                Agregar Cliente
              </button>
            */
            }
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-blue-400" />
                <p className="text-blue-400 text-sm font-medium">Total Clientes</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-green-400" />
                <p className="text-green-400 text-sm font-medium">Activos</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.active}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign size={20} className="text-purple-400" />
                <p className="text-purple-400 text-sm font-medium">Ingresos Totales</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Gift size={20} className="text-yellow-400" />
                <p className="text-yellow-400 text-sm font-medium">Gift Cards</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalGiftCards)}</p>
            </div>
          </div>

          {/* Barra de Búsqueda y Filtros */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-40 bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-48 bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  <option value="totalSpent">Mayor gasto</option>
                  <option value="clientProductQuantity">Más productos</option>
                  <option value="clientName">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-850">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Gift Card
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-850 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {client.clientName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-100">{client.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail size={14} />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone size={14} />
                          <span>{formatPhone(client.phone)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-blue-400" />
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                          {client.clientProductQuantity} unidades
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(client.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.giftCard > 0 ? (
                        <div className="flex items-center gap-2">
                          <Gift size={16} className="text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">
                            {formatCurrency(client.giftCard)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        client.active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {client.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/*<button
                          onClick={() => handleEdit(client._id)}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>*/}
                        <button
                          onClick={() => handleSub(client._id)}
                          className={`p-2  ${
                        client.active
                          ? ' text-green-400'
                          : ' text-red-400'
                      }`}
                        >
                          {client.active ? <BadgeMinus size={18} /> : <BadgePlus size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estado Vacío */}
        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
              <Users size={48} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Comienza agregando tu primer cliente'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientList