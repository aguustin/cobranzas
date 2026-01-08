import { Link } from "react-router-dom"

const Lists = () => {
    return(
        <>
            <nav>
                <button>+ Nueva Tienda</button>
                <label>*cantidad de tiendas creadas*</label>
            </nav>
            <div>
               <table>
                    <thead>
                        <tr>
                            <th>Nombre de la tienda</th>
                            <th>Ventas</th>
                            <th>Cajeros</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>**</td>
                        </tr>
                        <tr>
                            <td>**</td>                       
                        </tr>
                        <tr>
                            <td>**</td>                      
                        </tr>
                        <tr>
                            <button>Ver</button>
                            <button>Editar</button>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/*ver tienda*/}
            <div>
                <nav>
                    <button>Resumen</button>
                    <Link to="/">Cajeros</Link>
                    <Link to="/">Productos</Link>
                    <Link to="/">Ventas</Link>
                </nav>
            </div>
            {/*editar tienda*/}
            <div>

            </div>
        </>
    )
}

export default Lists