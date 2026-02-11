import axios from "axios";

export const newSellRequest = (data) => axios.post('http://localhost:4000/new_sell', data)

export const getSellDataRequest = (storeId: string, cashierId: string) =>
  axios.get("http://localhost:4000/sell_data", {
    params: { storeId, cashierId }
  });

