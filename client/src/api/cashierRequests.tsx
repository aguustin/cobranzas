import axios from "axios";

export const getAllCashiers = () => axios.get('http://localhost:4000/get_all_cashiers')

export const registerCashierRequest = (formData: FormData) => axios.post('http://localhost:4000/register_cashier', formData)