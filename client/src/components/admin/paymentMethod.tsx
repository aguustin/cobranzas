import  { useContext, useEffect, useRef, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Settings, ExternalLink, Shield, DollarSign, Info } from 'lucide-react';
import ContextBody from '../../context';
import { connectPayPalRequest } from '../../api/sellRequests';
import axios from 'axios';

const ConnectPayment = ({ onNewSell }) => {
  const { session } = useContext(ContextBody)
  const [showPayPal, setShowPayPal] = useState(false)
  const paypalRef = useRef(null)

  const [paymentProviders, setPaymentProviders] = useState([
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Acepta pagos con tarjetas, efectivo y más',
      logo: '💳',
      color: 'from-blue-600 to-blue-500',
      connected: false,
      accountEmail: '',
      authUrl: 1,//`https://auth.mercadopago.com.ar/authorization?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=https://tusistema.com/oauth/callback`,
      features: ['Tarjetas de crédito y débito', 'Efectivo en puntos de pago', 'Transferencias bancarias', 'QR Code'],
      fees: '2.99% + $0.30 por transacción'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Plataforma de pagos global para negocios',
      logo: '💸',
      color: 'from-purple-600 to-purple-500',
      connected: false,
      accountEmail: 'tienda@ejemplo.com',
      authUrl:2,
      features: ['Pagos internacionales', 'Suscripciones recurrentes', 'API completa', 'Anti-fraude avanzado'],
      fees: '2.9% + $0.30 por transacción'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Acepta pagos de millones de usuarios',
      logo: '🌐',
      color: 'from-blue-500 to-indigo-500',
      connected: false,
      accountEmail: '',
      authUrl:3, //`https://www.paypal.com/signin/authorize?client_id=${VITE_PAYPAL_CLIENT_ID}&response_type=code&scope=openid&redirect_uri=https://tuapp.com/paypal/callback`,
      features: ['Pagos internacionales', 'Protección del comprador', 'PayPal Credit', 'Pago en un click'],
      fees: '3.4% + $0.30 por transacción'
    }
  ]);


 /* const [selectedProvider, setSelectedProvider] = useState(null);
  const [connectForm, setConnectForm] = useState({
    email: '',
    apiKey: '',
    secretKey: ''
  });*/
  let resd;
  const paymentGateway = async (gatewayType: number) => {
    switch (gatewayType){
        case 1:
            resd = await onNewSell();
            console.log(resd)
            break;
        case 2:
            
            break;
        case 3:     
            setShowPayPal(true)
        break;    
    }
  }



  useEffect(() => {

    if (!showPayPal) return

    if (!window.paypal) return

    window.paypal.Buttons({

      createOrder: async () => {
        const res = await axios.post("/api/paypal/create-order", {
          amount: "10.00" // 🔥 cámbialo dinámico
        })

        return res.data.id
      },

      onApprove: async (data) => {

        await axios.post("/api/paypal/capture-order", {
          orderId: data.orderID
        })

        // 🔥 ejecutas tu lógica de venta
        await onNewSell()

        alert("Pago exitoso ✅")
      },

      onError: (err) => {
        console.error("PayPal error:", err)
        alert("Error en el pago ❌")
      }

    }).render(paypalRef.current)

  }, [showPayPal])

  /*const handleConnect = (provider) => {
    setSelectedProvider(provider);
  };*/

  /*const handleDisconnect = (providerId) => {
    setPaymentProviders(prev =>
      prev.map(p =>
        p.id === providerId
          ? { ...p, connected: false, accountEmail: '' }
          : p
      )
    );
  };*/

  const connectedCount = paymentProviders.filter(p => p.connected).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="text-indigo-500" size={40} />
            Configuración de Pagos y Cobros
          </h1>
          <p className="text-gray-400">Conecta tus cuentas de pago para comenzar a recibir dinero</p>
        </div>

        {/* Tarjetas de Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={24} className="text-indigo-400" />
              <p className="text-indigo-400 text-sm font-medium">Métodos Conectados</p>
            </div>
            <p className="text-3xl font-bold text-white">{connectedCount} / {paymentProviders.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-green-400" />
              <p className="text-green-400 text-sm font-medium">Estado de Seguridad</p>
            </div>
            <p className="text-xl font-bold text-white">
              {connectedCount > 0 ? 'Protegido' : 'Sin configurar'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Settings size={24} className="text-purple-400" />
              <p className="text-purple-400 text-sm font-medium">Estado de Cuenta</p>
            </div>
            <p className="text-xl font-bold text-white">
              {connectedCount > 0 ? 'Activa' : 'Inactiva'}
            </p>
          </div>
        </div>

        {/* Información Importante */}
        <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-400 font-semibold mb-1">
                Importante sobre las conexiones
              </p>
              <p className="text-xs text-blue-400/80">
                Puedes conectar múltiples métodos de pago. Tus clientes podrán elegir su método preferido al momento de pagar. Todas las conexiones están encriptadas y son seguras.
              </p>
            </div>
          </div>
        </div>

        {/* Proveedores de Pago */}
        <div className="space-y-6">
          {paymentProviders.map((provider) => (
            <div
              key={provider.id}
              className={`bg-gradient-to-br from-gray-900 to-gray-800 border rounded-xl overflow-hidden shadow-xl transition-all ${
                provider.connected ? 'border-green-500/50' : 'border-gray-800'
              }`}
            >
              <div className="p-6">
                {/* Header del Proveedor */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${provider.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {provider.logo}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{provider.name}</h3>
                        {provider.connected ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                            <CheckCircle size={14} />
                            Conectado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
                            <XCircle size={14} />
                            No conectado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{provider.description}</p>
                      {provider.connected && (
                        <p className="text-gray-500 text-sm">
                          Cuenta: <span className="text-indigo-400 font-medium">{provider.accountEmail}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <div>
                    {/*provider.connected ? (
                      /*<button
                        onClick={() => handleDisconnect(provider.id)}
                        className="px-6 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-all border border-red-600/30"
                      >
                        Desconectar
                      </button>
                      ) : (
                      )*/}
                    
                        <button
                            onClick={() => paymentGateway(provider.authUrl)}
                            className={`px-6 py-2.5 bg-gradient-to-r ${provider.color} hover:opacity-90 text-white rounded-lg font-semibold transition-all shadow-lg`}
                        >
                            Elegir metodo
                        </button>
                    
                  </div>
                </div>

                {/* Características */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Características</h4>
                    <ul className="space-y-1">
                      {provider.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Comisiones</h4>
                    <p className="text-sm text-gray-300">{provider.fees}</p>
                    
                    {provider.connected && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Acciones</h4>
                        <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                          <Settings size={14} />
                          Configuración avanzada
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información de Seguridad */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="text-green-400" size={24} />
            <div>
              <h3 className="text-xl font-bold mb-2">Seguridad y Protección</h3>
              <p className="text-gray-400 text-sm">
                Todas tus conexiones están protegidas con encriptación de nivel bancario. Nunca almacenamos información sensible de tarjetas de crédito.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">Encriptación SSL/TLS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">Cumplimiento PCI-DSS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">Autenticación 2FA</span>
            </div>
          </div>
        </div>
      </div>
         {showPayPal && (
        <div>
          <h3>Pagar con PayPal</h3>
          <div ref={paypalRef}></div>
        </div>
      )}
    </div>
  );
}

export default ConnectPayment