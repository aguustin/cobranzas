import axios from "axios";

export const getAllClients = (storeId: string) => axios.get(`http://localhost:4000/get_clients/${storeId}`)

export const unsubClientRequest = ({clientId}) => axios.post('http://localhost:4000/unsub_client', {clientId})