import { useEffect, useState } from "react";
import type { CreateProductBody } from "../../interfaces";
import { registerProductRequest } from "../../api/productRequests";
import { ChevronLeft, Plus } from "lucide-react";

interface CreateProductProps {
    setHideCreateProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Category {
    id: string;
    name: string;
}

const CreateProduct = ({setHideCreateProduct}: CreateProductProps) => {
    const [message, setMessage] = useState<number>(0)
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {

    }, [])

    const registerProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget;

        const productData: CreateProductBody = {
                storeId:form.storeId.value,
                productName:form.productName.value,
                productPrice:form.productPrice.value,
                productCategory:form.productCategory.value,
                productDiscount:form.productDiscount.value,
                productQuantity:form.productQuantity.value,
                productTaxe:form.productTaxe.value
        }

        const success = await registerProductRequest(productData)
        return setMessage(success.data)
        
    } 

    return(
        
 <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between">
          {/* Botón Volver */}
          <div className="mb-6">
            <button 
              onClick={() => setHideCreateProduct(false)} 
              className="flex items-center gap-2 mt-1 px-4 py-2.5 bg-indigo-600/50 hover:bg-indigo-700/50 text-white rounded-lg font-medium transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
              Volver
            </button>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crear Nuevo Producto</h1>
            <p className="text-gray-400">Completa la información del producto para agregarlo al inventario</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => registerProduct(e)} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8">
            
            {/* Nombre del Producto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Nombre del producto
              </label>
              <input 
                className="form-input-create-product" 
                type="text" 
                name="productName"
                placeholder="Ej: Camisa Casual Azul"
              />
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Categoría
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
                  Nueva Categoría
                </button>
              </div>
            </div>

            {/* Grid de Campos Numéricos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Precio */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Precio del producto
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input 
                    className="form-input-number-create-product" 
                    type="number" 
                    name="productPrice"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Descuento */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Descuento
                </label>
                <div className="relative">
                  <input 
                    className="form-input-number-create-product px-4 pr-10" 
                    type="number" 
                    name="productDiscount"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Stock
                </label>
                <input 
                  className="form-input-number-create-product px-4" 
                  type="number" 
                  name="productQuantity"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Impuesto */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Impuesto del producto
                </label>
                <div className="relative">
                  <input 
                    className="form-input-number-create-product px-4 pr-10" 
                    type="number" 
                    name="productTaxe"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <button className="important-element px-8 py-3 rounded-lg font-semibold" type="submit">Registrar Producto</button>
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
            <span className="font-semibold">💡 Consejo:</span> Asegúrate de completar todos los campos para una mejor gestión de tu inventario.
          </p>
        </div>
      </div>
    </div>
    )
}

export default CreateProduct