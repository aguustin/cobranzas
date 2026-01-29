import axios from "axios";

export const registerProductRequest = (formData: FormData) => axios.post('http://localhost:4000/register_product', formData)

export const listProductsRequest = ({storeId, filter}) => axios.post(`http://localhost:4000/get_products_filter`, {storeId, filter})

export const getProductByIdRequest = ({storeId, productMongoId}) => axios.get(`http://localhost:4000/get_product_by_id/${storeId}/${productMongoId}`)

export const updateProductRequest = (formData: FormData) => axios.post('http://localhost:4000/update_product', formData)

export const getProductsRequest = () => axios.get('http://localhost:4000/get_all_products')
