import { useState } from 'react';
import { ChevronLeft, DollarSign, Hash, Package, CreditCard, Printer, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createBoxRequest } from '../../api/boxRequests';

const CreateBox = () => {

  const {storeId} = useParams<{ storeId: string}>()

  const [formData, setFormData] = useState({
        storeId: storeId,
        boxName: '',
        boxNumber: '',
        totalMoneyInBox: 0,
        location: '',
        paymentTerminal: '',
        printer: '',
        maxDiscount: 20,
        allowRefunds: true,
        allowCashWithdrawal: false,
        requireManagerAuth: true,
        maxTransactionAmount: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const createBox = async () => {
    const res = await createBoxRequest({formData})
    console.log(res.data)
    alert('Caja registrada exitosamente');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crear Nueva Caja</h1>
            <p className="text-gray-400">Configura una nueva caja de pago para tu tienda</p>
          </div>
          {/* Botón Volver */}
          <div className="mb-6">
            <button 
              className="flex items-center mt-1 gap-2 px-4 py-2.5 bg-indigo-600/50 hover:bg-indigo-700/50 text-white rounded-lg font-medium transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
              Volver
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8">
            
            {/* Sección: Información Básica */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-indigo-400" size={24} />
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre de Caja */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Nombre de la Caja
                  </label>
                  <input 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="text" 
                    name="boxName"
                    value={formData.boxName}
                    onChange={handleChange}
                    placeholder="Ej: Caja Principal"
                  />
                </div>

                {/* Número de Caja */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Número de Caja
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="text" 
                      name="boxNumber"
                      value={formData.boxNumber}
                      onChange={handleChange}
                      placeholder="001"
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Ubicación en Tienda
                  </label>
                  <input 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Planta Baja - Frente"
                  />
                </div>

                {/* Efectivo Inicial */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Efectivo Inicial
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="number" 
                      name="totalMoneyInBox"
                      value={formData.totalMoneyInBox}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Hardware y Equipamiento */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Printer className="text-purple-400" size={24} />
                Hardware y Equipamiento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Terminal de Pago */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Terminal de Pago (POS)
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="text" 
                      name="terminal"
                      value={formData.terminal}
                      onChange={handleChange}
                      placeholder="Ej: Terminal-POS-001"
                    />
                  </div>
                </div>

                {/* Impresora */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Impresora de Tickets
                  </label>
                  <div className="relative">
                    <Printer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="text" 
                      name="printer"
                      value={formData.printer}
                      onChange={handleChange}
                      placeholder="Ej: Epson TM-T20III"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Configuración de Operaciones */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="text-green-400" size={24} />
                Configuración de Operaciones
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Descuento Máximo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Descuento Máximo Permitido
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="number" 
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                  </div>
                </div>

                {/* Monto Máximo por Transacción */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Monto Máximo por Transacción
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      type="number" 
                      name="maxTransactionAmount"
                      value={formData.maxTransactionAmount}
                      onChange={handleChange}
                      placeholder="0 = Sin límite"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Permisos y Restricciones */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Permisos y Restricciones</h3>
                
                {/* Permitir Devoluciones */}
                <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="allowRefunds"
                    checked={formData.allowRefunds}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-gray-200 font-medium">Permitir Devoluciones</span>
                    <p className="text-gray-500 text-sm">El cajero puede procesar devoluciones de productos</p>
                  </div>
                </label>

                {/* Permitir Retiro de Efectivo */}
                <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="allowCashWithdrawal"
                    checked={formData.allowCashWithdrawal}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-gray-200 font-medium">Permitir Retiro de Efectivo</span>
                    <p className="text-gray-500 text-sm">El cajero puede realizar retiros de efectivo de la caja</p>
                  </div>
                </label>

                {/* Requiere Autorización de Gerente */}
                <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="requireManagerAuth"
                    checked={formData.requireManagerAuth}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-gray-200 font-medium">Requiere Autorización de Gerente</span>
                    <p className="text-gray-500 text-sm">Operaciones críticas requieren aprobación del gerente</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Resumen de Configuración */}
            <div className="mb-6 p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-indigo-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="text-indigo-300 font-semibold mb-2">Resumen de Configuración</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Caja:</span> {formData.boxName || 'Sin nombre'} ({formData.boxNumber || 'Sin número'})
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Efectivo inicial:</span> ${formData.totalMoneyInBox.toFixed(2)}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Descuento máx:</span> {formData.maxDiscount}%
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Devoluciones:</span> {formData.allowRefunds ? '✓ Permitidas' : '✗ No permitidas'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 justify-end">
              <button 
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]" 
                type="button"
                onClick={createBox}
              >
                Crear Caja
              </button>
              <button 
                className="cursor-pointer px-8 py-3 bg-gray-800 hover:bg-red-500/30 hover:text-white text-gray-400 rounded-lg font-semibold transition-all border border-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>

        {/* Información Adicional */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            <span className="font-semibold">💡 Consejo:</span> Configura correctamente los permisos y límites de cada caja según las necesidades de tu tienda.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateBox;