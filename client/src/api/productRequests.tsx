import axios from "axios";
import type { CreateProductBody } from "../interfaces";

export const registerProductRequest = (productData: CreateProductBody) => axios.post('http://localhost:4000/register_product', productData)
