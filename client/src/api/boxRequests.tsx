import axios from "axios";


export const getBoxesListRequest = ({storeId}) => axios.post(`http://localhost:4000/boxes_list`, {storeId}) 

export const createBoxRequest = ({formData}) => axios.post(`http://localhost:4000/create_box/`, {formData})

export const openCloseBoxRequest = (data) => axios.post(`http://localhost:4000/open_close_box`, data)

export const deleteAllBoxesRequest = () => axios.delete(`http://localhost:4000/delete_all_boxes`)
