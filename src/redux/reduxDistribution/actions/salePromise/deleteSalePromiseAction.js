import { DELETE_PROMISE_SALE } from "../../types/SalePromiseType";
import axios from "axios";

const deleteSalePromiseAction = (id) => {
  return {
    type: DELETE_PROMISE_SALE,
    payload: id,
  };
};

export const deleteSalePromise = (id) => {
  return async (dispatch) => {
    try {
      await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `sale-promise-invoice/${id}`,
        data: {
          status: false,
        },
      });

      dispatch(deleteSalePromiseAction(id));
    } catch (error) {
      console.log(error.message);
    }
  };
};
