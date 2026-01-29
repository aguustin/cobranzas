import { ChevronLeft, Plus, Trash2, Upload, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdRequest, updateProductRequest } from "../../api/productRequests";


type ProductBody = {
    productName: string,
    productPrice: number,
    productCategory: string,
    productDiscount: number,
    productQuantity: number,
    productTaxe: number
}


const EditProductForm = () => {
    const { storeId, productId } = useParams<{ storeId: string, productId: string}>();
    const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80');
    const [productImgFile, setProductImgFile] = useState(null);
    
    const [productData, setProductData] = useState<ProductBody>({
        productName: '',
        productPrice: 0,
        productCategory: '',
        productDiscount: 0,
        productQuantity: 0,
        productTaxe: 0
    })

    const numericFields = [
        'productPrice',
        'productDiscount',
        'productQuantity',
        'productTaxe'
    ];


  // Categorías de ejemplo
  const categories = [
    { name: 'Camisas' },
    { name: 'Pantalones' },
    { name: 'Vestidos' },
    { name: 'Chaquetas' },
    { name: 'Accesorios' },
  ];

  useEffect(() => {
        getProductByIdRequest({storeId, productMongoId: productId}).then(res => {
            setProductData({
                productName: res.data.productName,
                productPrice: res.data.productPrice,
                productCategory: res.data.productCategory,
                productDiscount: res.data.productDiscount,
                productQuantity: res.data.productQuantity,
                productTaxe: res.data.productTaxe
            })
            setImagePreview(res.data.productImg)
        })
  }, []);
  console.log('productData:', productData);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setProductImgFile(null);
    const fileInput = document.getElementById('productImg');
    if (fileInput) fileInput.value = '';
  };

  const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('storeId', storeId);
    formData.append('productMongoId', productId);
    Object.entries(productData).forEach(([key, value]) => {
          formData.append(key, String(value));
    });
    if (productImgFile) {
        formData.append('productImg', productImgFile);
    }

    await updateProductRequest(formData);
    
    alert('Producto actualizado exitosamente');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Editar Producto</h1>
            <p className="text-gray-400">Actualiza la información del producto</p>
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
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8">
            
            {/* Sección de Imagen */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <label className="block text-sm font-semibold text-gray-400 mb-4">
                Imagen del Producto
              </label>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Preview de la imagen */}
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa del producto" 
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
                    <Package className="text-gray-500" size={48} />
                  </div>
                )}

                {/* Botón de carga */}
                <div className="flex-1">
                  <label 
                    htmlFor="productImg" 
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
                    id="productImg"
                    name="productImg"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Nombre del Producto */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Nombre del producto
              </label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                type="text" 
                name="productName"
                value={productData.productName}
                onChange={handleChange}
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    name="productCategory"
                    value={productData.productCategory}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories?.map((c, index) => (
                      <option key={index} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-750 text-gray-200 rounded-lg font-medium transition-all border border-gray-700 hover:border-indigo-500 whitespace-nowrap"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="number" 
                    name="productPrice"
                    value={productData.productPrice}
                    onChange={handleChange}
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="number" 
                    name="productDiscount"
                    value={productData.productDiscount}
                    onChange={handleChange}
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                  type="number" 
                  name="productQuantity"
                  value={productData.productQuantity}
                  onChange={handleChange}
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                    type="number" 
                    name="productTaxe"
                    value={productData.productTaxe}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                </div>
              </div>
            </div>

            {/* Resumen de Precio */}
            <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Precio base:</span>
                  <span className="text-white font-semibold ml-2">${productData.productPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Descuento ({productData.productDiscount}%):</span>
                  <span className="text-green-400 font-semibold ml-2">-${(productData.productPrice * (productData.productDiscount / 100)).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Precio con descuento:</span>
                  <span className="text-white font-semibold ml-2">${(productData.productPrice * (1 - productData.productDiscount / 100)).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Impuesto ({productData.productTaxe}%):</span>
                  <span className="text-yellow-400 font-semibold ml-2">+${(productData.productPrice * (1 - productData.productDiscount / 100) * (productData.productTaxe / 100)).toFixed(2)}</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-indigo-500/30">
                  <span className="text-gray-400 text-base">Precio final:</span>
                  <span className="text-indigo-400 font-bold text-xl ml-2">
                    ${(productData.productPrice * (1 - productData.productDiscount / 100) * (1 + productData.productTaxe / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 justify-end">
              <button 
                className="important-element px-8 py-3 rounded-lg font-semibold" 
                type="button"
                onClick={updateProduct}
              >
                Guardar Cambios
              </button>
              <button 
                className="cursor-pointer px-8 py-3 bg-gray-800 hover:bg-red-500/30 hover:text-white text-gray-400 rounded-lg font-semibold transition-all border border-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            <span className="font-semibold">💡 Consejo:</span> Mantén actualizada la información de tus productos para ofrecer datos precisos a tus clientes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;