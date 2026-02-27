import React, { useState } from 'react';
import { Check, X, Zap, Rocket, Crown, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChoosePlan = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' o 'yearly'
  const navigate = useNavigate()

  const plans = [
    {
      id: 1,
      name: 'Free',
      description: 'Perfecto para empezar',
      price: 0,
      icon: Star,
      color: 'from-gray-700 to-gray-600',
      borderColor: 'border-gray-700',
      buttonStyle: 'bg-gray-700 hover:bg-gray-600',
      features: [
        { text: '1 Tienda', included: true },
        { text: '1 Cajero', included: true },
        { text: 'Hasta 50 productos', included: true },
        { text: '100 ventas/mes', included: true },
        { text: 'Reportes básicos', included: true },
        { text: 'Soporte por email', included: false },
        { text: 'Múltiples cajas', included: false },
        { text: 'API Access', included: false },
        { text: 'Soporte prioritario', included: false },
        { text: 'Exportación de datos', included: false }
      ]
    },
    {
      id: 2,
      name: 'Starter',
      description: 'Para pequeños negocios',
      price: 20000,
      icon: Zap,
      color: 'from-blue-600 to-blue-500',
      borderColor: 'border-blue-500',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      popular: false,
      features: [
        { text: 'Hasta 3 Tiendas', included: true },
        { text: 'Hasta 5 Cajeros', included: true },
        { text: 'Productos ilimitados', included: true },
        { text: '1,000 ventas/mes', included: true },
        { text: 'Soporte por email', included: true },
        { text: 'Reportes avanzados', included: true },
        { text: 'Múltiples cajas', included: true },
        { text: 'Exportación de datos', included: true },
        { text: 'API Access', included: false },
        { text: 'Soporte prioritario', included: false }
      ]
    },
    {
      id: 3,
      name: 'Professional',
      description: 'Para negocios en crecimiento',
      price: 50000,
      icon: Rocket,
      color: 'from-indigo-600 to-purple-600',
      borderColor: 'border-indigo-500',
      buttonStyle: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      popular: true,
      features: [
        { text: 'Hasta 10 Tiendas', included: true },
        { text: 'Cajeros ilimitados', included: true },
        { text: 'Productos ilimitados', included: true },
        { text: '10,000 ventas/mes', included: true },
        { text: 'Soporte 24/7', included: true },
        { text: 'Reportes avanzados', included: true },
        { text: 'Múltiples cajas', included: true },
        { text: 'Exportación de datos', included: true },
        { text: 'API Access', included: true },
        { text: 'Integración con sistemas', included: true }
      ]
    },
    {
      id: 4,
      name: 'Enterprise',
      description: 'Para grandes empresas',
      price: 100000,
      icon: Crown,
      color: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-500',
      buttonStyle: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
      popular: false,
      features: [
        { text: 'Tiendas ilimitadas', included: true },
        { text: 'Cajeros ilimitados', included: true },
        { text: 'Productos ilimitados', included: true },
        { text: 'Ventas ilimitadas', included: true },
        { text: 'Soporte prioritario 24/7', included: true },
        { text: 'Reportes personalizados', included: true },
        { text: 'Múltiples cajas', included: true },
        { text: 'Exportación de datos', included: true },
        { text: 'API Access completo', included: true },
        { text: 'Gerente de cuenta dedicado', included: true }
      ]
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getYearlyPrice = (monthlyPrice) => {
    if (monthlyPrice === 0) return 0;
    return monthlyPrice * 12 * 0.8; // 20% descuento anual
  };

  const handleSelectPlan = (planId) => {
    console.log('Plan seleccionado:', planId, billingCycle);
    // Aquí iría la navegación a la página de pago
    navigate(`/checkout/${planId}/${billingCycle}`)
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Elige el Plan Perfecto
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              para tu Negocio
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Gestiona tus tiendas, cajeros y ventas con la plataforma más completa del mercado
          </p>

          {/* Toggle Mensual/Anual */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-16 h-8 rounded-full transition-all ${
                billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                Ahorra 20%
              </span>
            )}
          </div>
        </div>

        {/* Grid de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = billingCycle === 'monthly' ? plan.price : getYearlyPrice(plan.price);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'border-indigo-500 shadow-indigo-500/20' 
                    : plan.borderColor
                }`}
              >
                {/* Badge Popular */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    MÁS POPULAR
                  </div>
                )}

                {/* Header del Plan */}
                <div className={`bg-gradient-to-br ${plan.color} p-6 text-center`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{plan.description}</p>
                  
                  {/* Precio */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(displayPrice)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-white/80 text-sm ml-2">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.price > 0 && (
                    <p className="text-white/60 text-xs">
                      ({formatPrice(plan.price)}/mes facturado anualmente)
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Botón */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-lg ${plan.buttonStyle}`}
                  >
                    {plan.id === 1 ? 'Comenzar Gratis' : 'Seleccionar Plan'}
                    <ArrowRight size={18} />
                  </button>

                  {plan.id === 1 && (
                    <p className="text-center text-xs text-gray-500 mt-3">
                      No requiere tarjeta de crédito
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Garantía */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8 max-w-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Garantía de 30 días</h3>
            <p className="text-gray-400">
              Prueba cualquier plan sin riesgo. Si no estás satisfecho, te devolvemos el 100% de tu dinero.
            </p>
          </div>
        </div>

        {/* FAQ o Contacto */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            ¿Necesitas un plan personalizado para tu empresa?
          </p>
          <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-semibold transition-all border border-gray-700">
            Contactar Ventas
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChoosePlan