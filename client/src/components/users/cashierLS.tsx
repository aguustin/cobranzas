import  { useContext, useEffect, useState } from 'react';
import { User, Lock, LogIn, UserPlus, Upload, Trash2, Clock, CheckCircle, XCircle, CreditCard, Settings, Calendar, LogOut } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loginCashierRequest, registerCashierRequest } from '../../api/cashierRequests';
import ContextBody from '../../context';
//import { useNotification } from '../../globalComp';

// ==================== COMPONENTE 1: Login de Cajero ====================

export function LoginCajero() {
  const { storeId } = useParams<{ storeId: string}>();  
  const [message, setMessage] = useState(0)
  const {loginCashierContext} = useContext(ContextBody)

  const [userData, setUserData] = useState({
    storeId: storeId,
    username: '',
    userpassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginCashierContext(userData)
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Acceso de Cajero</h1>
          <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => handleLogin(e)} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-8 shadow-2xl">
          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="text" 
                name="username"
                value={userData.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="password" 
                name="userpassword"
                value={userData.userpassword}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          {/* Botón Login */}
          <button 
            type='submit'
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02]"
          >
            <LogIn size={20} />
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
} 

// ==================== COMPONENTE 3: Registrar Cajero ====================
const CashierLS = () => {
  const navigate = useNavigate()
  const { storeId } = useParams<{ storeId: string}>();  
  const [imagePreview, setImagePreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [userData, setUserData] = useState({
    storeId: storeId,
    fullName: '',
    username: '',
    userpassword: '',
    userDni: ''
  });
  const [message, setMessage] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setPhotoFile(null);
    const fileInput = document.getElementById('userPhoto');
    if (fileInput) fileInput.value = '';
  };

  const registerCashier = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
          formData.append(key, String(value));
    });
    if (photoFile) {
        formData.append('userPhoto', photoFile);
    }
    const res = await registerCashierRequest(formData);
    setMessage(res.data)
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <UserPlus className="text-indigo-500" size={36} />
            Registrar Nuevo Cajero
          </h1>
          <p className="text-gray-400">Completa la información del cajero</p>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => registerCashier(e)} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl" encType='multipart/form-data'>
          <div className="p-8">
            
            {/* Sección de Foto */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <label className="block text-sm font-semibold text-gray-400 mb-4">
                Foto del Cajero
              </label>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Preview de la foto */}
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Foto del cajero" 
                      className="w-40 h-40 object-cover rounded-full border-4 border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 border-4 border-dashed border-gray-700 rounded-full flex items-center justify-center bg-gray-800/50">
                    <User className="text-gray-500" size={48} />
                  </div>
                )}

                {/* Botón de carga */}
                <div className="flex-1">
                  <label 
                    htmlFor="userPhoto" 
                    className="block p-6 text-center bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-all"
                  >
                    <Upload className="mx-auto mb-3 text-indigo-500" size={32} />
                    <span className="block text-lg font-semibold text-gray-300 mb-2">
                      {imagePreview ? 'Cambiar foto' : 'Cargar foto'}
                    </span>
                    <span className="block text-sm text-gray-400">
                      Arrastra una imagen o haz clic para seleccionar
                    </span>
                    <span className="block text-xs text-gray-500 mt-2">
                      PNG, JPG hasta 5MB
                    </span>
                  </label>
                  <input 
                    type="file" 
                    id="userPhoto"
                    name="userPhoto"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  type="text" 
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              

              {/* DNI */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  DNI
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="text" 
                    name="userDni"
                    value={userData.userDni}
                    onChange={handleChange}
                    placeholder="12345678"
                  />
                </div>
              </div>
            </div>

              {/* Usuario */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="text" 
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>


            {/* Contraseña */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  type="password" 
                  name="userpassword"
                  value={userData.userpassword}
                  onChange={handleChange}
                  placeholder="Contraseña segura"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-700 justify-end">
              <button 
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]" 
                type="submit"
              >
                Registrar Cajero
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
            <span className="font-semibold">💡 Consejo:</span> Asegúrate de que el cajero tenga acceso a sus credenciales de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}


const CashierProfile = () => {
const { storeId } = useParams<{ storeId: string}>(); 
const {cashierSession} = useContext(ContextBody)
   const getRoleLabel = (role) => {
    const roles = {
      'cashier': 'Cajero',
      'manager': 'Gerente',
      'admin': 'Administrador'
    };
    return roles[role] || role;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleLogout = () => {
    console.log('Cerrando sesión...');
    // Aquí iría tu lógica de logout
  };

  return(
    <>
     
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con botón de logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Perfil de Cajero</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

        {/* Tarjeta Principal de Perfil */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-2xl mb-6">
          <div className="p-8">
            
            {/* Sección Superior - Foto y Datos Básicos */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-700">
              
              {/* Foto de Perfil */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden bg-gray-800">
                  {cashierSession.user.userPhoto ? (
                    <img 
                      src={cashierSession.user.userPhoto} 
                      alt={cashierSession.user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-gray-500" />
                    </div>
                  )}
                </div>
                {/* Badge de Rol */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 rounded-full">
                  <span className="text-white text-xs font-semibold uppercase">
                    {getRoleLabel(cashierSession.user.userRole)}
                  </span>
                </div>
              </div>

              {/* Información Básica */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {cashierSession.user.fullName}
                </h2>
                <p className="text-gray-400 mb-4">
                  Usuario activo desde {formatDate(cashierSession.user.UserDate)}
                </p>
                
                {/* Badges de Estado */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    ● En línea
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                    Sesión Activa
                  </span>
                </div>
              </div>
            </div>

            {/* Grid de Información Detallada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DNI */}
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase">DNI</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {cashierSession.user.userDni.toLocaleString('es-AR')}
                </p>
              </div>

              {/* Fecha de Registro */}
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase">Fecha de Registro</h3>
                </div>
                <p className="text-xl font-bold text-white">
                  {formatDate(cashierSession.user.UserDate)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatTime(cashierSession.user.UserDate)} hs
                </p>
              </div>
                {/* Rol */}
               <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase">Rol</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {getRoleLabel(cashierSession.user.userRole)}
                </p>
              </div>

              {/* Tiempo en Sesión */}
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase">Tiempo en Sesión</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  2h 34m
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Última actividad: Hace 5 min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Acciones Rápidas */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="text-indigo-400" size={24} />
            Acciones Rápidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={`/boxes_list/${storeId}`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-left"><button>
              Abrir Caja
            </button></Link>
            <Link to={`/new_sell/${storeId}`} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all text-left"><button>
              Nueva Venta
            </button></Link>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-left">
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  
    </>
  )
}

// ==================== COMPONENTE PRINCIPAL (para demostración) ====================
const CashierSystem = () => {
  const {cashierSession} = useContext(ContextBody)
  const [vista, setVista] = useState('login');
 // const {notifications, showNotification, removeNotification} = useNotification()
  const [message, setMessage] = useState(0)
  
  if (cashierSession && cashierSession.user) {
    return <CashierProfile />;
  }
  return (
    <div>
      {/* Menú de navegación para demo */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setVista('login')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            vista === 'login' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          Login
        </button>
        <button 
          onClick={() => setVista('registrar')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            vista === 'registrar' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          Registrar
        </button>
      </div>

      {/* Renderizar vista correspondiente */}
      {vista === 'login' && <LoginCajero />}
      {vista === 'registrar' && <CashierLS />}
      {message > 0  && showNotification({ type: 'success',
                message: '✓ Usuario registrado exitosamente',
                position: 'top-right'})
      }
    </div>
  );
}


export default CashierSystem;