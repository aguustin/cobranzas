import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShoppingCart, DollarSign, Package, CreditCard, Banknote } from 'lucide-react';

const NewSell = () => {
  // Estado para productos disponibles (simulando base de datos)
  const [availableProducts, setAvailableProducts] = useState([]);
  
  // Estado para el formulario actual
  const [formData, setFormData] = useState({
    productMongoId: '',
    productName: '',
    unityPrice: 0,
    finalSubTotal: 0,
    taxes: 0,
    netTotal: 0,
    paymentType: 'efectivo',
    productQuantity: 1
  });

  // Estado para los productos agregados al carrito
  const [products, setProducts] = useState([]);

  // Simular obtención de productos de la base de datos
  useEffect(() => {
    getProductInfo();
  }, []);

  // Función que simula obtener productos de la BD
  const getProductInfo = async () => {
    // Simulación de datos que vendrían de tu backend
    const mockProducts = [
      { 
        _id: '507f1f77bcf86cd799439011',
        name: 'Camisa Casual Azul',
        price: 4500,
        discount: 10,
        tax: 21,
        stock: 45
      },
      { 
        _id: '507f1f77bcf86cd799439012',
        name: 'Pantalón Denim Negro',
        price: 6500,
        discount: 5,
        tax: 21,
        stock: 32
      },
      { 
        _id: '507f1f77bcf86cd799439013',
        name: 'Vestido Floral Verano',
        price: 5500,
        discount: 15,
        tax: 21,
        stock: 28
      },
      { 
        _id: '507f1f77bcf86cd799439014',
        name: 'Chaqueta Cuero Premium',
        price: 12000,
        discount: 0,
        tax: 21,
        stock: 15
      },
    ];
    
    setAvailableProducts(mockProducts);
  };

  // Calcular valores automáticamente cuando se selecciona un producto o cambia cantidad
  const calculateValues = (product, quantity) => {
    if (!product) return;

    const priceAfterDiscount = product.price * (1 - product.discount / 100);
    const subtotal = priceAfterDiscount * quantity;
    const taxAmount = subtotal * (product.tax / 100);
    const total = subtotal + taxAmount;

    return {
      productMongoId: product._id,
      productName: product.name,
      unityPrice: product.price,
      finalSubTotal: subtotal,
      taxes: taxAmount,
      netTotal: total
    };
  };

  // Manejar selección de producto
  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const selectedProduct = availableProducts.find(p => p._id === productId);
    
    if (selectedProduct) {
      const calculatedValues = calculateValues(selectedProduct, formData.productQuantity);
      setFormData(prev => ({
        ...prev,
        ...calculatedValues
      }));
    } else {
      // Limpiar si no hay producto seleccionado
      setFormData(prev => ({
        ...prev,
        productMongoId: '',
        productName: '',
        unityPrice: 0,
        finalSubTotal: 0,
        taxes: 0,
        netTotal: 0
      }));
    }
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (e) => {
    const quantity = Number(e.target.value);
    const selectedProduct = availableProducts.find(p => p._id === formData.productMongoId);
    
    if (selectedProduct) {
      const calculatedValues = calculateValues(selectedProduct, quantity);
      setFormData(prev => ({
        ...prev,
        productQuantity: quantity,
        ...calculatedValues
      }));
    } else {
      setFormData(prev => ({ ...prev, productQuantity: quantity }));
    }
  };

  // Manejar cambio de método de pago
  const handlePaymentTypeChange = (e) => {
    setFormData(prev => ({ ...prev, paymentType: e.target.value }));
  };

  // Agregar producto al carrito
  const addProduct = () => {
    if (!formData.productMongoId) {
      alert('Por favor selecciona un producto');
      return;
    }

    if (formData.productQuantity <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    // Agregar producto al array
    setProducts(prev => [...prev, { ...formData }]);

    // Limpiar formulario
    setFormData({
      productMongoId: '',
      productName: '',
      unityPrice: 0,
      finalSubTotal: 0,
      taxes: 0,
      netTotal: 0,
      paymentType: 'efectivo',
      productQuantity: 1
    });

    // Resetear el select
    document.getElementById('productSelect').value = '';
  };

  // Eliminar producto del carrito
  const removeProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  // Calcular totales del carrito
  const cartTotals = {
    subtotal: products.reduce((sum, p) => sum + p.finalSubTotal, 0),
    taxes: products.reduce((sum, p) => sum + p.taxes, 0),
    total: products.reduce((sum, p) => sum + p.netTotal, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart className="text-indigo-500" size={36} />
          Nueva Venta
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario de Agregar Producto */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-indigo-400" size={24} />
                Agregar Producto
              </h2>

              {/* Seleccionar Producto */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Buscar Producto
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <select
                    id="productSelect"
                    onChange={handleProductSelect}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <option value="">Seleccionar producto...</option>
                    {availableProducts.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Campos Automáticos */}
              {formData.productMongoId && (
                <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3">Información del Producto</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Precio unitario:</span>
                      <span className="text-white font-semibold ml-2">{formatCurrency(formData.unityPrice)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-semibold ml-2">{formatCurrency(formData.finalSubTotal)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Impuestos:</span>
                      <span className="text-yellow-400 font-semibold ml-2">{formatCurrency(formData.taxes)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total:</span>
                      <span className="text-green-400 font-semibold ml-2">{formatCurrency(formData.netTotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Manuales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Cantidad
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="number"
                      value={formData.productQuantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Método de Pago
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <select
                      value={formData.paymentType}
                      onChange={handlePaymentTypeChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta_debito">Tarjeta de Débito</option>
                      <option value="tarjeta_credito">Tarjeta de Crédito</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="qr">QR / Billetera Virtual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botón Agregar */}
              <button
                onClick={addProduct}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
              >
                <Plus size={20} />
                Agregar Producto
              </button>
            </div>
          </div>

          {/* Carrito de Compras */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="text-green-400" size={24} />
                Carrito
                <span className="ml-auto text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  {products.length} items
                </span>
              </h2>

              {/* Lista de Productos */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No hay productos en el carrito</p>
                  </div>
                ) : (
                  products.map((product, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-200">{product.productName}</h3>
                          <p className="text-xs text-gray-500">Cant: {product.productQuantity}</p>
                        </div>
                        <button
                          onClick={() => removeProduct(index)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          {product.paymentType === 'efectivo' && <Banknote size={14} />}
                          {product.paymentType.includes('tarjeta') && <CreditCard size={14} />}
                          {product.paymentType === 'efectivo' ? 'Efectivo' : 
                           product.paymentType === 'tarjeta_debito' ? 'Débito' :
                           product.paymentType === 'tarjeta_credito' ? 'Crédito' :
                           product.paymentType === 'transferencia' ? 'Transfer.' : 'QR'}
                        </span>
                        <span className="text-green-400 font-semibold">{formatCurrency(product.netTotal)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totales */}
              {products.length > 0 && (
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-gray-200 font-semibold">{formatCurrency(cartTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Impuestos:</span>
                    <span className="text-yellow-400 font-semibold">{formatCurrency(cartTotals.taxes)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gray-700">
                    <span className="text-gray-200 font-bold">Total:</span>
                    <span className="text-green-400 font-bold">{formatCurrency(cartTotals.total)}</span>
                  </div>

                  {/* Botón Finalizar Venta */}
                  <button
                    onClick={() => {
                      console.log('Venta finalizada:', products);
                      alert(`Venta procesada: ${formatCurrency(cartTotals.total)}`);
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-green-500/20"
                  >
                    <ShoppingCart size={20} />
                    Finalizar Venta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSell;