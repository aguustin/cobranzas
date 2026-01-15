 import { ChevronLeft } from "lucide-react";
import { useContext, useState } from "react";
import ContextBody from "../../context";
import type { AxiosResponse } from "axios";
import { createStoreRequest } from "../../api/storeRequests";

interface CreateStoreProps {
    setHideCreateProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StoreTax {
  taxName: 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS'
  percentage: number
}

type TaxName = 'IVA' | 'IIBB' | 'TASA_MUNICIPAL' | 'GANANCIAS' | 'OTROS'

const CreateStore = ({setHideCreateProduct}: CreateStoreProps) => {
  const {session} = useContext(ContextBody)
  const [storeImgFile, setStoreImgFile] = useState<File | null>(null)
  const [taxes, setTaxes] = useState<StoreTax[]>([])
  const [taxeCategory, setTaxeCategory] = useState<TaxName>('IVA')
  const [percentage, setPercentage] = useState<number>(0)
  const [message, setMessage] = useState<number>(0)

  const createStore = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
     e.preventDefault()
     const form = e.currentTarget;
    console.log(form.storePassword.value, ' ',  form.confirmPassword.value)
    if(form.storePassword.value === form.confirmPassword.value){
       setMessage(0)
      
      const formData = new FormData()
      formData.append('managerId', session._id)
      formData.append('storeImg', storeImgFile!)
      formData.append('storeName', form.storeName.value)
      formData.append('domicile', form.domicile.value)
      formData.append('storePassword', form.storePassword.value)
      formData.append('identificationTaxNumber', form.identificationTaxNumber.value)
      formData.append('phone', form.phone.value)
      formData.append('storeEmail', form.storeEmail.value)
      formData.append('storeTaxes', JSON.stringify(taxes))
      
      const res: AxiosResponse<number> = await createStoreRequest(formData)
    }else{
      setMessage(1)
    }

    /*if(res.data){

    }*/
  }
 
    return(
 <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crear Nueva Tienda</h1>
            <p className="text-gray-400">Completa los datos de tu Tienda</p>
          </div>
          {/* Botón Volver */}
          <div className="mb-6">
            <button 
              onClick={() => setHideCreateProduct(false)} 
              className="flex items-center mt-1 gap-2 px-4 py-2.5 bg-indigo-600/50 hover:bg-indigo-700/50 text-white rounded-lg font-medium transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
              Volver
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => createStore(e)} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl max-w-[685]" encType="multipart/form-data">
          <div className="p-8">
            
            {/* Nombre del Producto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Nombre de la tienda
              </label>
              <input 
                className="form-input-create-product" 
                type="text" 
                name="storeName"
                placeholder="Ej: Tienda nova"
              />
            </div>

            {/**Password de la tienda */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Contraseña de la tienda
              </label>
              <input 
                className="form-input-create-product" 
                type="password" 
                name="storePassword"
                placeholder=""
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Confirma tu contraseña
              </label>
              <input 
                className="form-input-create-product" 
                type="password" 
                name="confirmPassword"
                placeholder=""
              />
            </div>
            

             <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Domicilio
              </label>
              <input 
                className="form-input-create-product" 
                type="text" 
                name="domicile"
                placeholder=""
              />
            </div>
        
              {/* Precio */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Numero de Identificar de impuesto
                </label>
                <div className="relative">
                  <input 
                    className="form-input-number-create-product pl-4!" 
                    type="number" 
                    name="identificationTaxNumber"
                    placeholder="000"
                    min="0"
                  />
                </div>
              </div>

              {/* Telefono de la tienda */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Telefono
                </label>
                <div className="relative">
                  <input 
                    className="form-input-number-create-product px-4 pr-10" 
                    type="number" 
                    name="phone"
                    placeholder=""
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
              </div>

              {/**Email de la tienda */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input 
                    className="form-input-number-create-product px-4 pr-10" 
                    type="email" 
                    name="storeEmail"
                    placeholder=""
                  />
                 
                </div>
              </div>
              <div className="flex items-center">
                <div className="relative flex items-center justify-between">
                <button className="third-element py-2 px-6 cursor-pointer mr-2" type="button" onClick={() => setTaxes(prevTaxes => [...prevTaxes, { taxName: taxeCategory, percentage: percentage}])}>Agregar</button>
                  <select className="form-input-select-create-product w-[190px]" onChange={(e) => setTaxeCategory(e.target.value as TaxName)}>
                      <option value="IVA">IVA</option>
                      <option value="IIBB">IIBB</option>
                      <option value="TASA_MUNICIPAL">TASA_MUNICIPAL</option>
                      <option value="GANANCIAS">GANANCIAS</option>
                      <option value="OTROS">OTROS</option>
                  </select>
                  <input className="form-input-number-create-product w-[140px] pr-10" type="number" name="percentage" onChange={(e) => setPercentage(Number(e.target.value))}/>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
              </div>
              <div className="mt-1">
                {taxes.map((tax, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="success-text-without-bg">{tax.taxName}</span>
                    -
                    <span className="success-text-without-bg">{tax.percentage}%</span>
                  </div>
                ))}
              </div>
               <div>
                <label htmlFor="storeHtml" className="block p-3 text-sm font-semibold text-gray-400 mb-2 mt-6 text-center text-xl bg-gray-900 border-2 rounded-xl">
                  Cargar imagen
                  <svg className="mx-auto mt-3 mb-2" viewBox="0 0 24 24" width="32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#7c3aed"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.25C12.2106 2.25 12.4114 2.33852 12.5535 2.49392L16.5535 6.86892C16.833 7.17462 16.8118 7.64902 16.5061 7.92852C16.2004 8.20802 15.726 8.18678 15.4465 7.88108L12.75 4.9318V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V4.9318L8.55353 7.88108C8.27403 8.18678 7.79963 8.20802 7.49393 7.92852C7.18823 7.64902 7.16698 7.17462 7.44648 6.86892L11.4465 2.49392C11.5886 2.33852 11.7894 2.25 12 2.25Z" fill="#7c3aed"></path> </g></svg>
                  <label className="text-sm text-blue-400">Puedes cargar una imagen de la tienda para que te ayude a ubicarte mejor</label>
                </label>
                <div className="relative object-none hidden">
                  <input 
                    className="form-input-create-product px-4 pr-10 " 
                    type="file" 
                    name="storeImg"
                    id="storeHtml"
                    onChange={(e) => setStoreImgFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              {message === 1 && 
                <div className="mt-6 text-center flex items-center bg-red-500/10 rounded-xl justify-center">
                  <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM11.25 13.5V8.25H12.75V13.5H11.25ZM11.25 15.75V14.25H12.75V15.75H11.25Z" fill="#f87171"></path> </g></svg>
                  <span className="text-red-400 p-3 font-medium">Las contraseñas no coinciden</span>
                </div>
              }
                

              {/* Tipo de moneda 
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Tipo de moneda
                </label>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <select 
                      className="form-input-select-create-product"
                      name="productCategory"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories?.map((c, index) => (
                        <option key={index} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button"
                    className="flex items-center gap-2 px-4 py-3 secondary-element text-gray-200 rounded-lg font-medium transition-all border border-gray-700 hover:border-purple-700 whitespace-nowrap"
                  >
                    <Plus size={18} />
                    Mo
                  </button>
                </div>
              </div>
*/}
          

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-700 mt-6 justify-end">
              <button className="important-element px-8 py-3 rounded-lg font-semibold" type="submit">Registrar Tienda</button>
              <button 
                onClick={() => setHideCreateProduct(false)}
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
            <span className="font-semibold">💡 Consejo:</span> Asegúrate de completar todos los campos para una mejor gestión de tu tienda.
          </p>
        </div>
      </div>
    </div>

    )
}

export default CreateStore