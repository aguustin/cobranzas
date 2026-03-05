import { useEffect, useState } from 'react';
import { DollarSign, Calculator, AlertCircle, CheckCircle, X, Circle, TrendingUp, TrendingDown, Printer, Save, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { boxMovementRequest, getBoxInfoRequest } from '../../api/boxRequests';

const CashCount = () => {
    const { storeId } = useParams<{ storeId: string}>();
    const [boxData, setBoxData] = useState([])
    const [cashierData, setCashierData] = useState()
    const [showModal, setShowModal] = useState(false);        
    const [errors, setErrors] = useState({});
    const [negativeAmount, setNegativeAmount] = useState()

    useEffect(() => {
        getBoxInfoFunc()
    },[])
    const getBoxInfoFunc = async () => {
        const cashierId = localStorage.getItem('cashierId')
        setCashierData(JSON.parse(localStorage.getItem('cashier')))
        const res = await getBoxInfoRequest({storeId, cashierId})
        setBoxData(res.data)
    }
  
  const [formData, setFormData] = useState({
        storeId: storeId,
        boxId: '',
        cashierId: '',
        cashierName: '',
        movementType: 'withdrawals',
        amount: '',
        reason: ''
  });
 
  const [denominations, setDenominations] = useState({
    bill_20000: 0,
    bill_10000: 0,
    bill_1000: 0,
    bill_500: 0,
    bill_200: 0,
    bill_100: 0,
    bill_50: 0,
    bill_20: 0,
    bill_10: 0,
    coin_10: 0,
    coin_5: 0,
    coin_2: 0,
    coin_1: 0,
    coin_050: 0,
    coin_025: 0
  });

  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const billsAndCoins = [
    { key: 'bill_20000', label: '$20000', value: 20000, type: 'Billetes' },
    { key: 'bill_10000', label: '$10000', value: 10000, type: 'Billetes' },
    { key: 'bill_1000', label: '$1000', value: 1000, type: 'Billetes' },
    { key: 'bill_500', label: '$500', value: 500, type: 'Billetes' },
    { key: 'bill_200', label: '$200', value: 200, type: 'Billetes' },
    { key: 'bill_100', label: '$100', value: 100, type: 'Billetes' },
    { key: 'bill_50', label: '$50', value: 50, type: 'Billetes' },
    { key: 'bill_20', label: '$20', value: 20, type: 'Billetes' },
    { key: 'bill_10', label: '$10', value: 10, type: 'Billetes' },
    { key: 'coin_10', label: '$10', value: 10, type: 'Monedas' },
    { key: 'coin_5', label: '$5', value: 5, type: 'Monedas' },
    { key: 'coin_2', label: '$2', value: 2, type: 'Monedas' },
    { key: 'coin_1', label: '$1', value: 1, type: 'Monedas' },
    { key: 'coin_050', label: '$0.50', value: 0.5, type: 'Monedas' },
    { key: 'coin_025', label: '$0.25', value: 0.25, type: 'Monedas' }
  ];

  const handleDenominationChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    setDenominations(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  // Calcular total contado
  const countedTotal = billsAndCoins.reduce((sum, item) => {
    return sum + (denominations[item.key] * item.value);
  }, 0);

  // Diferencia
  const difference = countedTotal - boxData.withdrawals;

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

  const handleComplete = () => {
    const arqueoData = {
      ...boxData,
      countedCash: countedTotal,
      difference: difference,
      denominations: denominations,
      notes: notes,
      completedAt: new Date().toISOString()
    };
    
    console.log('Arqueo completado:', arqueoData);
    setIsCompleted(true);
  };
  

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setDenominations({
      bill_20000: 0,
      bill_10000: 0,
      bill_1000: 0,
      bill_500: 0,
      bill_200: 0,
      bill_100: 0,
      bill_50: 0,
      bill_20: 0,
      bill_10: 0,
      coin_10: 0,
      coin_5: 0,
      coin_2: 0,
      coin_1: 0,
      coin_050: 0,
      coin_025: 0
    });
    setNotes('');
    setIsCompleted(false);
  };

  const billetes = billsAndCoins.filter(item => item.type === 'Billetes');
  const monedas = billsAndCoins.filter(item => item.type === 'Monedas');

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

   const handleSubmit = async () => {
     const data = {
       ...formData,
       boxId: boxData._id,
       cashierId: localStorage.getItem('cashierId'),
       cashierName: cashierData?.user?.fullName
      }

    await boxMovementRequest(data)
     if (formData.movementType === "withdrawals") {
    setNegativeAmount(
      (boxData.withdrawals || 0) + Number(formData.amount)
    );
  }
    // Resetear formulario
    /*setFormData({
      type: 'withdrawals',
      amount: '',
      reason: ''
    });*/
    
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Calculator className="text-indigo-500" size={40} />
            Arqueo de Caja
          </h1>
          <p className="text-gray-400">Verifica el efectivo físico contra el registrado en el sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Información de la Caja */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Datos del Sistema */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="text-green-400" size={24} />
                Información del Sistema
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Caja</p>
                  <p className="text-white font-bold text-lg">{boxData.boxNumber}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Cajero</p>
                  <p className="text-white font-bold text-lg">{cashierData?.user?.fullName}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Apertura</p>
                  <p className="text-white font-semibold">{formatDateTime(boxData.boxOpenDate)}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Cierre</p>
                  <p className="text-white font-semibold">{formatDateTime(boxData.boxCloseDate)}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-gray-300">Efectivo inicial:</span>
                  <span className="text-blue-400 font-bold">{formatCurrency(boxData.initialCash)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-gray-300">Ventas en efectivo:</span>
                  <span className="text-green-400 font-bold">+ {formatCurrency(boxData.cashSales)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-gray-300">Retiros:</span>
                  <span className="text-red-400 font-bold">- {formatCurrency(negativeAmount ?? boxData.withdrawals)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg border-2 border-purple-500/30">
                  <span className="text-white font-semibold text-lg">Efectivo Esperado:</span>
                  <span className="text-purple-400 font-bold text-2xl">{formatCurrency(boxData.expectedCash)}</span>
                </div>
              </div>
            </div>

            {/* Conteo de Denominaciones */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Conteo de Efectivo</h2>

              {/* Billetes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Billetes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {billetes.map(item => (
                    <div key={item.key} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <label className="block text-sm text-gray-400 mb-2">{item.label}</label>
                      <input
                        type="number"
                        min="0"
                        value={denominations[item.key]}
                        onChange={(e) => handleDenominationChange(item.key, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {formatCurrency(denominations[item.key] * item.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monedas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Monedas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {monedas.map(item => (
                    <div key={item.key} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <label className="block text-sm text-gray-400 mb-2">{item.label}</label>
                      <input
                        type="number"
                        min="0"
                        value={denominations[item.key]}
                        onChange={(e) => handleDenominationChange(item.key, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {formatCurrency(denominations[item.key] * item.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Agrega cualquier observación sobre el arqueo..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Resumen y Resultado */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl sticky top-8">
              <h2 className="text-xl font-bold mb-6">Resultado del Arqueo</h2>

              {/* Total Contado */}
              <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Total Contado</p>
                <p className="text-3xl font-bold text-indigo-400">{formatCurrency(countedTotal)}</p>
              </div>

              {/* Esperado */}
              <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Efectivo Esperado</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(boxData.expectedCash)}</p>
              </div>

              {/* Diferencia */}
              <div className={`mb-6 p-6 rounded-lg border-2 ${
                difference === 0 
                  ? 'bg-green-500/10 border-green-500/50' 
                  : difference > 0 
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-red-500/10 border-red-500/50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {difference === 0 ? (
                    <CheckCircle size={32} className="text-green-400" />
                  ) : difference > 0 ? (
                    <TrendingUp size={32} className="text-blue-400" />
                  ) : (
                    <TrendingDown size={32} className="text-red-400" />
                  )}
                  <div>
                    <p className="text-gray-400 text-sm">Diferencia</p>
                    <p className={`text-3xl font-bold ${
                      difference === 0 
                        ? 'text-green-400' 
                        : difference > 0 
                          ? 'text-blue-400'
                          : 'text-red-400'
                    }`}>
                      {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                    </p>
                  </div>
                </div>

                <div className={`mt-4 p-3 rounded-lg ${
                  difference === 0 
                    ? 'bg-green-500/20' 
                    : difference > 0 
                      ? 'bg-blue-500/20'
                      : 'bg-red-500/20'
                }`}>
                  <p className={`text-sm font-semibold ${
                    difference === 0 
                      ? 'text-green-300' 
                      : difference > 0 
                        ? 'text-blue-300'
                        : 'text-red-300'
                  }`}>
                    {difference === 0 
                      ? '✓ Caja cuadrada - Sin diferencias' 
                      : difference > 0 
                        ? '↑ Sobrante de efectivo'
                        : '↓ Faltante de efectivo'}
                  </p>
                </div>
              </div>

              {/* Botones de Acción */}
              {!isCompleted ? (
                <div className="space-y-3">
                  <button
                    onClick={handleComplete}
                    disabled={countedTotal === 0}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      countedTotal === 0
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    <Save size={20} />
                    Completar Arqueo
                  </button>
                      <button
              onClick={() => setShowModal(true)}
              className="w-full! flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-green-500/20 md:w-auto"
            >
              <Plus size={20} />
              Nuevo Movimiento
            </button>
                  <button
                    onClick={resetForm}
                    className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all border border-gray-700"
                  >
                    Reiniciar Conteo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
                    <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-semibold">Arqueo Completado</p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
                  >
                    <Printer size={20} />
                    Imprimir Reporte
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all border border-gray-700"
                  >
                    Nuevo Arqueo
                  </button>
                </div>
              )}

              {/* Advertencia si hay diferencia */}
              {difference !== 0 && countedTotal > 0 && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-400">
                      Se detectó una diferencia. Verifica el conteo antes de completar el arqueo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
            {/* Modal de Nuevo Movimiento */}
              {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
                    
                    {/* Header del Modal */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                      <h3 className="text-2xl font-bold">Nuevo Movimiento</h3>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setFormData({ movementType: 'withdrawals', amount: '', reason: '' });
                          setErrors({});
                        }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <X size={24} className="text-gray-400" />
                      </button>
                    </div>
        
                    {/* Contenido del Modal */}
                    <div className="p-6 space-y-5">
                      
                      {/* Tipo de Movimiento */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-3">
                          Tipo de Movimiento
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, movementType: 'withdrawals' }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.movementType === 'withdrawals'
                                ? 'bg-red-500/20 border-red-500 text-red-400'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            <TrendingDown size={24} className="mx-auto mb-2" />
                            <span className="font-semibold">Retiro</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, movementType: 'deposit' }))}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.movementType === 'deposit'
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            <TrendingUp size={24} className="mx-auto mb-2" />
                            <span className="font-semibold">Ingreso</span>
                          </button>
                        </div>
                      </div>
        
                      {/* Monto */}
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
        
                      {/* Motivo */}
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
        
                      {/* Advertencia */}
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
                    {/* Footer del Modal */}
                    <div className="flex gap-3 p-6 border-t border-gray-700">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setFormData({ movementType: 'withdrawals', amount: '', reason: '' });
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
              )}
      </div>
    </div>
  );
}

export default CashCount