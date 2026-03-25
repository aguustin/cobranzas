import axios from "axios";

export const newSellRequest = (data) => axios.post('http://localhost:4000/new_sell', data)

export const getSellDataRequest = (storeId: string, cashierId: string) =>
  axios.get("http://localhost:4000/sell_data", {
    params: { storeId, cashierId }
  });

export const getSellsRequest = () => axios.get('http://localhost:4000/get_sells')


export const getReportRequest = async (storeId: string, reportType: string, filters: any) => {
  return await axios.post(`http://localhost:4000/reports/${storeId}`, {
    reportType,
    filters
  });
};

export const getOrdersRequest = ({storeId}) => axios.post('http://localhost:4000/orders', {storeId})


export const connectPayPalRequest = ({userId}) => axios.post("http://localhost:4000/api/paypal/connect", {userId})