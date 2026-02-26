import axios from "axios";


type userDataBody = {
    storeId:string,
    username:string,
    userpassword:string,
}

export const getAllCashiersRequest = ({storeId}) => axios.get(`http://localhost:4000/get__store_cashiers/${storeId}`)

export const registerCashierRequest = (formData: FormData) => axios.post('http://localhost:4000/register_cashier', formData)

export const loginCashierRequest = (userData: userDataBody) => axios.post('http://localhost:4000/login_cashier', userData)