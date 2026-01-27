import axios from "axios";
import type { CreateProductBody } from "../interfaces";

export const registerProductRequest = (productData: CreateProductBody) => axios.post('http://localhost:4000/register_product', productData)

export const listProductsRequest = ({storeId, filter}) => axios.post(`http://localhost:4000/get_products_filter`, {storeId, filter})

export const getProductsRequest = () => axios.get('http://localhost:4000/get_all_products')
