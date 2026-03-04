import axios from "axios";


export const getBoxesListRequest = ({storeId}) => axios.post(`http://localhost:4000/boxes_list`, {storeId}) 

export const createBoxRequest = ({formData}) => axios.post(`http://localhost:4000/create_box/`, {formData})

export const openCloseBoxRequest = (data) => axios.post(`http://localhost:4000/open_close_box`, data)

export const deleteAllBoxesRequest = () => axios.delete(`http://localhost:4000/delete_all_boxes`)

export const getBoxInfoRequest = ({storeId, cashierId}) => axios.post(`http://localhost:4000/get_box`, {storeId, cashierId})

export const cashCountRequest = ({storeId, cashierId}) => axios.post('http://localhost:4000/update_cash_in_box', {storeId, cashierId})

export const boxMovementRequest = (data) => axios.post('http://localhost:4000/box_movement', data)

export const getMovementsRequest = ({storeId}) => axios.get(`http://localhost:4000/get_movements/${storeId}`)