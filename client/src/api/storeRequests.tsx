import axios from "axios";
//import type { CreateStoreBody } from "../interfaces";

export const createStoreRequest = (formData: FormData) => axios.post('http://localhost:4000/create_store', formData)

export const listStoresRequest = (sessionId: string) => axios.get(`http://localhost:4000/get_all_stores/${sessionId}`)

export const getStoreRequest = ({storeId}: string) => axios.post('http://localhost:4000/get_store', {storeId})

export const updateStoreRequest = (formData: FormData) => axios.post('http://localhost:4000/update_store', formData)

//export const getStoreBoxRequest = ({storeId}: string) => axios.post('http://localhost:4000/get_store', {storeId})
export const getDayDataRequest = ({storeId}: string) => axios.get(`http://localhost:4000/get_day_data/${storeId}`)

export const getAllStatisticsRequest = ({storeId}: string) => axios.get(`http://localhost:4000/get_statistics/${storeId}`)