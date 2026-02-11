import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, Trash2, ShoppingCart, DollarSign, Package, CreditCard, Banknote } from 'lucide-react';
import { listProductsRequest } from '../../api/productRequests';
import { useParams } from 'react-router-dom';
import { getSellDataRequest, newSellRequest } from '../../api/sellRequests';
import axios from 'axios';

const NewSell = () => {

  type ProductFrontend = {
    productId: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
    productTaxe: number;
    subTotal: number;
    totalEarned: number;
    paymentType: string;
    productDiscount: number;
  }

  type SellData = {
    storeName: string;
    boxId: string;
  }

  const [sellData, setSellData] = useState<SellData | null>(null);
  // Estado para productos disponibles (simulando base de datos)
  const { storeId } = useParams<{ storeId: string}>();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [giftMount, setGiftMount] = useState(0)
  const [cashierId, setCashierId] = useState<string | null>(null);
  // Estado para el formulario actual
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    productPrice: 0,
    subTotalEarned: 0,
    productTaxe: 0,
    totalEarned: 0,
    paymentType: 'efectivo',
    productDiscount: 0,
    productQuantity: 1
  });

  // Estado para los productos agregados al carrito
  const [products, setProducts] = useState<ProductFrontend[]>([]);
  // Simular obtención de productos de la base de datos
  useEffect(() => {
    const storedCashierId = sessionStorage.getItem('cashierId');
    setCashierId(storedCashierId);
  }, []);

  useEffect(() => {
    const listProducts = async () => {
      const filter = 1
      const res = await listProductsRequest({storeId, filter});
      setAvailableProducts(res.data);
    }
    listProducts()
  }, []);

  useEffect(() => {
    const loadSellData = async () => {
      if (!cashierId) return;

      const res = await getSellDataRequest(storeId, cashierId);

      setSellData({
        storeName: res.data.storeName,
        boxId: res.data.boxId
      });
    };

    loadSellData();
}, [storeId, cashierId]);
 
  // Calcular valores automáticamente cuando se selecciona un producto o cambia cantidad
  const calculateValues = (product, quantity) => {
  if (!product) return;

  const priceAfterDiscount = product.productPrice * (1 - product.productDiscount / 100);
  const subTotalEarned = priceAfterDiscount * quantity;
  const productTaxe = subTotalEarned * (product.productTaxe / 100);
  const totalEarned = subTotalEarned + productTaxe;

  return {
    productId: product._id,
    productName: product.productName,
    productPrice: product.productPrice,
    subTotalEarned,
    productTaxe,
    totalEarned
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
      console.log('form data: ', formData)
    } else {
      // Limpiar si no hay producto seleccionado
      setFormData(prev => ({
        ...prev,
        productId: '',
        productName: '',
        productPrice: 0,
        subTotalEarned: 0,
        productTaxe: 0,
        totalEarned: 0
      }));
    }
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (e) => {
    const quantity = Number(e.target.value);
    const selectedProduct = availableProducts.find(p => p._id === formData.productId);
    
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
  if (!formData.productId) return alert('Por favor selecciona un producto');
  if (formData.productQuantity <= 0) return alert('La cantidad debe ser mayor a 0');

  // Agregar producto al carrito
  setProducts(prev => [...prev, { ...formData }]);

  // Limpiar formulario
  setFormData({
    productId: '',
    productName: '',
    productPrice: 0,
    subTotalEarned: 0,
    productTaxe: 0,
    totalEarned: 0,
    paymentType: 'efectivo',
    productDiscount: 0,
    productQuantity: 1
  });

  document.getElementById('productSelect').value = '';
};

  // Eliminar producto del carrito
  const removeProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  // Calcular totales del carrito
  const cartTotals = {
    subtotal: products.reduce((sum, p) => sum + p.subTotalEarned, 0),
    productTaxe: products.reduce((sum, p) => sum + p.productTaxe, 0),
    total: products.reduce((sum, p) => sum + p.totalEarned, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

const newSellFunc = async () => {
  if (!sellData || !cashierId) return;

  // Solo enviamos los campos necesarios
  const productsToSend = products.map(p => ({
    productId: p.productId,
    productQuantity: p.productQuantity,
    paymentType: p.paymentType,
    productDiscount: p.productDiscount
  }));

  try {
    const res = await axios.post('http://localhost:4000/new_sell', {
      products: productsToSend,
      storeId,
      giftMount,
      storeName: sellData.storeName,
      cashierId,
      boxId: sellData.boxId
    });

    console.log("Venta realizada:", res.data);

    // Limpiar carrito después de la venta
    setProducts([]);
  } catch (error) {
    console.error("Error al realizar la venta:", error);
  }
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
              <div className='w-full flex justify-between'>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="text-indigo-400" size={24} />
                  Agregar Producto
                </h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Monto de regalo:
                  </label>
                  <input onChange={(e) => setGiftMount(e.target.value)} type='number' placeholder='0' value={giftMount} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-2 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"></input>
                </div>
              </div>

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
                        {product.productName} - {formatCurrency(product.productPrice)} (Stock: {product.productQuantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Campos Automáticos */}
              {formData.productId && (
                <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3">Información del Producto</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Precio unitario:</span>
                      <span className="text-white font-semibold ml-2">{formatCurrency(formData.productPrice)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-semibold ml-2">{formatCurrency(formData.subTotalEarned)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Impuestos:</span>
                      <span className="text-yellow-400 font-semibold ml-2">{formatCurrency(formData.productTaxe)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total:</span>
                      <span className="text-green-400 font-semibold ml-2">{formatCurrency(formData.totalEarned)}</span>
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
                        <span className="text-green-400 font-semibold">{formatCurrency(product.totalEarned)}</span>
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
                    <span className="text-yellow-400 font-semibold">{formatCurrency(cartTotals.productTaxe)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gray-700">
                    <span className="text-gray-200 font-bold">Total:</span>
                    <span className="text-green-400 font-bold">{formatCurrency(cartTotals.total)}</span>
                  </div>

                  {/* Botón Finalizar Venta */}
                  <button
                    onClick={() => newSellFunc()}
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