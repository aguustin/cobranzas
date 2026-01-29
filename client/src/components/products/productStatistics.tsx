import { useParams } from "react-router-dom";

const ProductStatistics = () => {
    const { storeId, productId } = useParams<{ storeId: string, productId: string}>();
    return (
      <div>
        Estadísticas del producto {productId} de la tienda {storeId}
        </div>
    );
  }

export default ProductStatistics;