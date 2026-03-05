import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Clock, FileText } from 'lucide-react';

const BoxMovement = () => {
  const [showModal, setShowModal] = useState(false);
  const [movements, setMovements] = useState([
    {
      id: 1,
      type: 'ingreso',
      amount: 5000,
      reason: 'Fondo inicial de caja',
      date: '2026-03-03T09:00:00',
      user: 'María González'
    },
    {
      id: 2,
      type: 'retiro',
      amount: 2000,
      reason: 'Pago a proveedor de limpieza',
      date: '2026-03-03T11:30:00',
      user: 'María González'
    },
    {
      id: 3,
      type: 'ingreso',
      amount: 3500,
      reason: 'Devolución de préstamo',
      date: '2026-03-03T14:15:00',
      user: 'María González'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'retiro',
    amount: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando se edita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.reason || formData.reason.trim() === '') {
      newErrors.reason = 'El motivo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newMovement = {
      id: movements.length + 1,
      type: formData.type,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      date: new Date().toISOString(),
      user: 'María González' // Vendría del contexto/sesión
    };

    setMovements(prev => [newMovement, ...prev]);
    
    // Resetear formulario
    setFormData({
      type: 'retiro',
      amount: '',
      reason: ''
    });
    
    setShowModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular balance
  const balance = movements.reduce((sum, mov) => {
    return sum + (mov.type === 'ingreso' ? mov.amount : -mov.amount);
  }, 0);

  const totalIngresos = movements
    .filter(m => m.type === 'ingreso')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalRetiros = movements
    .filter(m => m.type === 'retiro')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Movimientos de Caja</h1>
              <p className="text-gray-400">Historial de ingresos y retiros de la sesión actual</p>
            </div>
            {/*<button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto"
            >
              <Plus size={20} />
              Nuevo Movimiento
            </button>*/}
          </div>

          {/* Tarjetas de Resumen 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} className="text-green-400" />
                <p className="text-green-400 text-sm font-medium">Total Ingresos</p>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalIngresos)}</p>
            </div>

            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-700/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown size={24} className="text-red-400" />
                <p className="text-red-400 text-sm font-medium">Total Retiros</p>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalRetiros)}</p>
            </div>

            <div className={`bg-gradient-to-br ${
              balance >= 0 
                ? 'from-indigo-900/40 to-indigo-800/20 border-indigo-700/30' 
                : 'from-orange-900/40 to-orange-800/20 border-orange-700/30'
            } border rounded-xl p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <FileText size={24} className={balance >= 0 ? 'text-indigo-400' : 'text-orange-400'} />
                <p className={`text-sm font-medium ${balance >= 0 ? 'text-indigo-400' : 'text-orange-400'}`}>
                  Balance
                </p>
              </div>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-orange-400'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>*/}
        </div>

        {/* Historial de Movimientos */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-indigo-400" size={24} />
              Historial de Movimientos
            </h2>
          </div>

          <div className="divide-y divide-gray-800">
            {movements.length === 0 ? (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay movimientos registrados</h3>
                <p className="text-gray-500">Comienza registrando un nuevo movimiento</p>
              </div>
            ) : (
              movements.map((movement) => (
                <div 
                  key={movement.id}
                  className="p-6 hover:bg-gray-850 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icono */}
                      <div className={`p-3 rounded-lg ${
                        movement.type === 'ingreso' 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        {movement.type === 'ingreso' ? (
                          <TrendingUp size={24} className="text-green-400" />
                        ) : (
                          <TrendingDown size={24} className="text-red-400" />
                        )}
                      </div>

                      {/* Detalles */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            movement.type === 'ingreso'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {movement.type}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-2">
                            <Clock size={14} />
                            {formatDateTime(movement.date)}
                          </span>
                        </div>
                        <p className="text-white font-medium mb-1">{movement.reason}</p>
                        <p className="text-gray-400 text-sm">Realizado por: {movement.user}</p>
                      </div>
                    </div>

                    {/* Monto */}
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        movement.type === 'ingreso' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {movement.type === 'ingreso' ? '+' : '-'} {formatCurrency(movement.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/*showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            
            
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-2xl font-bold">Nuevo Movimiento</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ type: 'retiro', amount: '', reason: '' });
                  setErrors({});
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

           
            <div className="p-6 space-y-5">
              
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-3">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'retiro' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'retiro'
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <TrendingDown size={24} className="mx-auto mb-2" />
                    <span className="font-semibold">Retiro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'ingreso' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'ingreso'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <TrendingUp size={24} className="mx-auto mb-2" />
                    <span className="font-semibold">Ingreso</span>
                  </button>
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Monto <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-gray-100 focus:outline-none transition-all ${
                      errors.amount 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.amount}
                  </p>
                )}
              </div>

            
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Motivo <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe el motivo del movimiento..."
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-gray-100 focus:outline-none transition-all resize-none ${
                    errors.reason 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                {errors.reason && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.reason}
                  </p>
                )}
              </div>

              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-semibold mb-1">
                      Este movimiento se registrará de forma permanente
                    </p>
                    <p className="text-xs text-yellow-400/80">
                      Verifica que los datos sean correctos antes de confirmar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ type: 'retiro', amount: '', reason: '' });
                  setErrors({});
                }}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all border border-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                <Save size={20} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )*/}
    </div>
  );
}

export default BoxMovement