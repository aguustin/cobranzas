import axios from "axios";


export const getBoxesListRequest = ({storeId}) => axios.get(`http://localhost:4000/boxes_list/${storeId}`) 

export const createBoxRequest = ({formData}) => axios.post(`http://localhost:4000/create_box/`, {formData})

export const openCloseBoxRequest = ({boxId, isOpen}) => axios.put(`http://localhost:4000/open_close_box/${boxId}/${isOpen}`)