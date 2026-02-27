import { useEffect, useState } from 'react';
import { CreditCard, Lock, Calendar, User, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { initMercadoPago, loadMercadoPago } from "@mercadopago/sdk-js";
import { changePlanRequest } from '../../api/managerRequests';


const CheckoutForm = () => {
  const { planId, billingCycle } = useParams<{ storeId: string}>();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    documentType: 'dni',
    documentNumber: '', 
    dni: '',
    email: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  const [cardType, setCardType] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const plans = {
      1: { name: "Free", price: 0 },
      2: { name: "Starter", price: 20000 },
      3: { name: "Professional", price: 50000 },
      4: { name: "Enterprise", price: 100000 },
    };
    
    const selectedPlan = plans[Number(planId)] || plans[1];
    
    const finalPlan = {
        ...selectedPlan,
        billingCycle,
    };
    const finalPrice = billingCycle === "yearly" ? selectedPlan.price * 12 * 0.8 : selectedPlan.price;


  const handleChange = (e) => {
    let { name, value } = e.target;

    // Formateo específico según el campo
    if (name === 'cardNumber') {
      // Remover espacios y limitar a 16 dígitos
      value = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
      // Agregar espacios cada 4 dígitos
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      
      // Detectar tipo de tarjeta
      if (value.startsWith('4')) {
        setCardType('visa');
      } else if (value.startsWith('5')) {
        setCardType('mastercard');
      } else if (value.startsWith('3')) {
        setCardType('amex');
      } else {
        setCardType('');
      }
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    if (name === 'expiryDate') {
        // Remover todo excepto números
        value = value.replace(/\D/g, '');
        
        // Formatear como MM/AAAA
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 6);
        }
    }

    if (name === 'documentNumber' || name === 'zipCode') {
        value = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

const generateCardToken = async () => {
  e.preventDefault()
  const mp = await loadMercadoPago();
  mp.initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
    locale: "es-AR",
  });

  const [month, year] = formData.expiryDate.split("/");

    const cardToken = await mp.createCardToken({
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardHolder,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: formData.cvv,
        identificationType: formData.documentType.toUpperCase(),
        identificationNumber: formData.documentNumber,
    });

    return cardToken.id;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = await generateCardToken();
    const userJWT = localStorage.getItem("token");
    await changePlanRequest(
      {
        cardToken: token,
        subscriptionPlan: Number(planId),
      },
      userJWT
    );

    alert("Suscripción creada correctamente");
  } catch (error) {
    console.error(error);
    alert("Error al crear la suscripción");
  }
};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Vista de éxito
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h2>
            <p className="text-gray-400 mb-6">
              Tu suscripción al plan <span className="text-white font-semibold">{finalPlan.name}</span> ha sido activada correctamente.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Monto procesado</p>
              <p className="text-3xl font-bold text-green-400">{formatPrice(finalPlan.price)}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-4">
            <ArrowLeft size={20} />
            Volver a Planes
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Información de Pago</h1>
          <p className="text-gray-400">Completa los datos para finalizar tu suscripción</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario de Pago */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 md:p-8 shadow-2xl">
              
              {/* Indicador de Seguridad */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Lock size={20} className="text-green-400" />
                <span className="text-sm text-green-400 font-medium">Pago 100% seguro y encriptado</span>
              </div>

              {/* Tarjeta de Crédito/Débito */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="text-indigo-400" size={24} />
                  Datos de la Tarjeta
                </h3>

                {/* Número de Tarjeta */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Número de Tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    {cardType && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          cardType === 'visa' ? 'bg-blue-600 text-white' :
                          cardType === 'mastercard' ? 'bg-red-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {cardType.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Titular de la Tarjeta */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Titular de la Tarjeta
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleChange}
                      placeholder="NOMBRE APELLIDO"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 uppercase focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Fecha de Vencimiento y CVV */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Fecha de Vencimiento
                    </label>
                    <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/AAAA"
                    maxLength={7}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                    CVV
                    </label>
                    <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                </div>
              </div>

              {/* Información Personal */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="text-purple-400" size={24} />
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DNI */}
                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Tipo de Documento
                    </label>
                    <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    >
                    <option value="dni">DNI</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="ci">Cédula de Identidad</option>
                    <option value="le">Libreta de Enrolamiento</option>
                    <option value="lc">Libreta Cívica</option>
                    <option value="cuil">CUIL</option>
                    <option value="cuit">CUIT</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Número de Documento
                    </label>
                    <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de Facturación */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Dirección de Facturación</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      placeholder="Calle y número"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Buenos Aires"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="1234"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Pago */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-indigo-500/20"
              >
                <Lock size={20} />
                Pagar {formatPrice(finalPlan.price)}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Al confirmar el pago, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-2xl sticky top-8">
              <h3 className="text-xl font-bold mb-6">Resumen de Compra</h3>

              {/* Plan Seleccionado */}
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Plan {finalPlan.name}</h4>
                    <p className="text-xs text-gray-400">
                      Facturación {finalPlan.billingCycle === 'monthly' ? 'mensual' : 'anual'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desglose */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">{formatPrice(finalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">IVA (21%)</span>
                  <span className="text-white font-semibold">{formatPrice(finalPrice * 0.21)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total a pagar</span>
                <span className="text-3xl font-bold text-indigo-400">
                  {formatPrice(finalPrice)}
                </span>
              </div>

              {/* Garantía */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-400 font-semibold mb-1">
                      Garantía de 30 días
                    </p>
                    <p className="text-xs text-gray-400">
                      Si no estás satisfecho, te devolvemos el 100% de tu dinero
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm