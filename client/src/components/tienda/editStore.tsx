import { ChevronLeft, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStoreRequest, updateStoreRequest } from "../../api/storeRequests";

interface FormDataBody  {
    storeName: string,
    domicile: string,
    identificationTaxNumber: number,
    phone: number,
    storeEmail: string,
    active: boolean
}

interface StoreTax {
  taxName: 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS'
  percentage: number
}

type TaxName = 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS'

const EditStoreForm = () => {
  const { storeId } = useParams<{ storeId: string}>();

  const [storeImgFile, setStoreImgFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>()
  const [taxes, setTaxes] = useState<StoreTax[]>([])
  const [taxeCategory, setTaxeCategory] = useState<TaxName>('IVA')
  const [percentage, setPercentage] = useState<number>()
  const [storeData, setStoreData] = useState<FormDataBody>({  
        storeName: "",
        domicile: "",
        identificationTaxNumber: 0,
        phone: 0,
        storeEmail: "",
        active: true
  })
  const [showSubsAlert, setShowSubsAlert] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>()

  useEffect(() => {
    const getStoreFunc = async () => {
      const res = await getStoreRequest({storeId})
      console.log(res.data.storeImg)
      setImagePreview(res.data.storeImg)
      setTaxes(res.data.storeTaxes)
      setStoreData({
        storeName:res.data.storeName,
        domicile:res.data.domicile,
        identificationTaxNumber: res.data.identificationTaxNumber,
        phone: res.data.phone,
        storeEmail:res.data.storeEmail,
        active:res.data.active
      })
    } 
    getStoreFunc()
  }, [storeId])
    
  const handleChange = (e) => {
      const { name, value } = e.target;
      setStoreData(prev => ({
          ...prev,
          [name]: value
      }));
  };

  const handleImageChange = (e) => {
    console.log(e.target.files?.[0])
    const file = e.target.files?.[0];
    if (file) {
      setStoreImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setStoreImgFile(null);
    const fileInput = document.getElementById('storeImg');
    if (fileInput) fileInput.value = '';
  };

  const removeTax = (index) => {
    setTaxes(prevTaxes => prevTaxes.filter((_, i) => i !== index));
  };

  const updateStore = async (): Promise<number> => {
      const formData = new FormData()
      formData.append("storeId", storeId!)
      formData.append("storeData", JSON.stringify(storeData))
      formData.append("taxes", JSON.stringify(taxes))
      formData.append("storeImg", storeImgFile!)
      const res = await updateStoreRequest(formData)
      console.log(res.data)
      return 1
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Editar Tienda</h1>
            <p className="text-gray-400">Actualiza los datos de tu tienda</p>
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
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <button className="bg-red-500/40 absolute right-4 top-2 font-medium px-3 py-1 rounded-xl hover:bg-red-500/60 transition-colors cu" onClick={() => setShowSubsAlert(true)}>Dar de baja</button>
          <div className="p-8">
            
            {/* Sección de Imagen */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <label className="block text-sm font-semibold text-gray-400 mb-4">
                Imagen de la Tienda
              </label>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Preview de la imagen */}
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa de la tienda" 
                      className="w-64 h-64 object-cover rounded-xl border-2 border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center bg-gray-800/50">
                    <Upload className="text-gray-500" size={48} />
                  </div>
                )}

                {/* Botón de carga */}
                <div className="flex-1">
                  <label 
                    htmlFor="storeImg" 
                    className="block p-6 text-center bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-all"
                  >
                    <Upload className="mx-auto mb-3 text-indigo-500" size={32} />
                    <span className="block text-lg font-semibold text-gray-300 mb-2">
                      {imagePreview ? 'Cambiar imagen' : 'Cargar imagen'}
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
                    id="storeImg"
                    name="storeImg"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Nombre de la tienda */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Nombre de la tienda
              </label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="text" 
                name="storeName"
                value={storeData.storeName}
                onChange={handleChange}
                placeholder="Ej: Tienda Nova"
              />
            </div>

            {/* Domicilio */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Domicilio
              </label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="text" 
                name="domicile"
                value={storeData.domicile}
                onChange={handleChange}
                placeholder="Dirección completa"
              />
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Número de Identificación de Impuesto */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Número de Identificación de Impuesto
                </label>
                <input 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  type="number" 
                  name="identificationTaxNumber"
                  value={storeData.identificationTaxNumber}
                  onChange={handleChange}
                  placeholder="000"
                  min="0"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Teléfono
                </label>
                <input 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  type="number" 
                  name="phone"
                  value={storeData.phone}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Email
              </label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="email" 
                name="storeEmail"
                value={storeData.storeEmail}
                onChange={handleChange}
                placeholder="email@ejemplo.com"
              />
            </div>

            {/* Sección de Impuestos */}
            <div className="mb-6 pb-6 border-b border-gray-700">
              <label className="block text-sm font-semibold text-gray-400 mb-4">
                Impuestos
              </label>
              
              {/* Agregar nuevo impuesto */}
              <div className="flex items-end gap-3 mb-4">
                <div className="flex-1">
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer" 
                    onChange={(e) => setTaxeCategory(e.target.value as TaxName)}
                    value={taxeCategory}
                  >
                    <option value="IVA">IVA</option>
                    <option value="IIBB">IIBB</option>
                    <option value="TASA_MUNICIPAL">TASA_MUNICIPAL</option>
                    <option value="GANANCIAS">GANANCIAS</option>
                    <option value="OTROS">OTROS</option>
                  </select>
                </div>
                <div className="relative">
                  <input 
                    className="w-40 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="number" 
                    name="percentage" 
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all" 
                  type="button" 
                  onClick={() => {
                    if (percentage > 0) {
                      setTaxes(prevTaxes => [...prevTaxes, { taxName: taxeCategory, percentage: percentage }]);
                      setPercentage(0);
                    }
                  }}
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>

              {/* Lista de impuestos */}
              <div className="space-y-2">
                {taxes.map((tax, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 group hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-semibold">{tax.taxName}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-green-400 font-semibold">{tax.percentage}%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTax(index)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {taxes.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No hay impuestos agregados</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 justify-end">
              <button 
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all" 
                type="button"
                onClick={updateStore}
              >
                Guardar Cambios
              </button>
              <Link to={'/store_list'} className="cursor-pointer px-8 py-3 bg-gray-800 hover:bg-red-500/30 hover:text-white text-gray-400 rounded-lg font-semibold transition-all border border-gray-700">
                Cancelar
              </Link>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            <span className="font-semibold">💡 Consejo:</span> Mantén actualizada la información de tu tienda para mejorar la experiencia de tus clientes.
          </p>
        </div>
      </div>
      {showSubsAlert && 
        <div>
          <p>{active ? 'Deseas darle de alta a la tienda nuevamente?' : 'Si le das de baja la tienda no actualizara productos, precios ni clientes. Deseas continuar?' }</p>
          <div>
            <button onClick={() => setShowSubsAlert(!showSubsAlert)}>Cancelar</button>
            <button>Confirmar</button>
          </div>
        </div>
      }
    </div>
  );
}

export default EditStoreForm