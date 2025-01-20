import { PROMISE_SALE_DETAILS } from "../../types/SalePromiseType";
import axios from "axios";

const detailSalePromiseAction = (data) => {
  return {
    type: PROMISE_SALE_DETAILS,
    payload: data,
  };
};

export const loadSingleSalePromise = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`sale-promise-invoice/${id}`);

      dispatch(detailSalePromiseAction(data));
    } catch (error) {
      console.log(error.message);
    }
  };
};
