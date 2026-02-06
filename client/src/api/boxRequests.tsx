import axios from "axios";


export const getBoxesListRequest = (data) => axios.post(`http://localhost:4000/boxes_list`, data) 

export const createBoxRequest = ({formData}) => axios.post(`http://localhost:4000/create_box/`, {formData})

export const openCloseBoxRequest = (data) => axios.post(`http://localhost:4000/open_close_box`, data)
