import axios from "axios";
//import type { CreateStoreBody } from "../interfaces";

export const createStoreRequest = (formData: any) => axios.get('http://localhost:4000/create_store', formData)
