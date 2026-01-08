import { Package } from "lucide-react"

const Dashboard = () => {
    return(
        <>
        <button className="important-element p-3 mb-3 font-medium cursor-pointer">Crear producto</button>
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
                      <tr className="hover:bg-gray-850 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-100">{'nombre producto'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-semibold">{'producto precio'}</td>
                        <td className="px-6 py-4">
                          <span className="success-text px-3 py-1">
                            {'producto ventas'} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${''
                            /*producto.stock < 20
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-blue-500/10 text-blue-400'*/
                          }`}>
                            {'producto stock'} disponibles
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
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </>
    )
}

export default Dashboard