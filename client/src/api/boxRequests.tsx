import axios from "axios";


export const getBoxesListRequest = ({storeId}) => axios.get(`http://localhost:4000/boxes_list/${storeId}`) 