import { Package } from "lucide-react"
import { useEffect, useState } from "react"
import CreateProduct from "../admin/createProduct"
import { listProductsRequest } from "../../api/productRequests"

const Products = () => {
   type ProductBody = {
    _id:string,
    productId:string,
    productName:string,
    productPrice:number,
    productQuantity:number,
    totalSells:number
   }
   //const { storeId } = useParams<{ storeId: string}>();
   const [hideCreateProduct, setHideCreateProduct] = useState<boolean>(false)
   const [products, setProducts] = useState<ProductBody[]>([])
   const [filter, setFilter] = useState<number>(1)
        // productId:{type: String}, productName:{type: String}, productPrice:{type: Number}, productQuantity:{type: Number}

        useEffect(() => {
            //funcion para listar productos
            const storeId = '69715cef64fc5405c4d3115d' //aqui va el storeId
            const getProductsFilterFunc = async () => {
              const res = await listProductsRequest({storeId, filter});
              setProducts(res.data);
            }
            getProductsFilterFunc()
        }, [filter])
        console.log(products)
        /**   productId:{type: String},  //es el ID escrito a mano por los usuarios. productMongoId utilizado en los controladores es el _id
    productName:{type: String},
    productPrice:{type: Number},
    productCategory:{type: String},
    productQuantity
    totalSells */
            return(
                <>
                {!hideCreateProduct && 
                <>
                  <div className="flex items-center justify-between">
                  <button onClick={() => setHideCreateProduct(true)} className="important-element flex items-center p-3 mb-3 font-medium cursor-pointer"><svg className="mr-2" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f8f8f8de"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#f8f8f8de" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Crear producto</button>
                  <select onChange={(e) => setFilter(e.target.value)} className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                    <option value={1}>Todos los productos</option>
                    <option value={2}>Productos con bajo stock</option>
                    <option value={3}>Productos más vendidos</option>
                  </select>
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-800 bg-gray-850">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Producto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Precio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Ventas
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                              {/** mapeado de productos */}
                              {products.map((pr) => (
                                <tr key={pr._id} className="hover:bg-gray-850 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                                        <Package size={20} className="text-gray-400" />
                                      </div>
                                      <span className="font-medium text-gray-100">{pr.productName}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-300 font-semibold">{pr.productPrice}</td>
                                  <td className="px-6 py-4">
                                    <span className="success-text px-3 py-1">
                                      {pr.totalSells} unidades
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${''
                                      /*producto.stock < 20
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-blue-500/10 text-blue-400'*/
                                    }`}>
                                      {pr.productQuantity} disponibles
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                      <button className="cursor-pointer px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                                        Editar
                                      </button>
                                      <button className="cursor-pointer px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg transition-colors border border-gray-700">
                                        Ver
                                      </button>
                                    </div>
                                  </td>
                                </tr>))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                </>}
                    {hideCreateProduct && (<CreateProduct setHideCreateProduct={setHideCreateProduct} />)}
                </>
            )
    }

export default Products