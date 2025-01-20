import { ADD_SALE_PROMISE } from "../../types/SalePromiseType.js";
import axios from "axios";
import { toast } from "react-toastify";

const addSalePromiseAction = (data) => {
  return {
    type: ADD_SALE_PROMISE,
    payload: data,
  };
};

export const addSalePromise = (values) => {
  return async (dispatch) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `sale-promise/`,
        data: {
          ...values,
        },
      });

      const newData = {
        ...data.createdPromise,
        customer: data.customer,
      };

      dispatch(addSalePromiseAction(newData));
      toast.success("Promesse d'achat créée avec succès");
      return {
        createdPromiseId: data.createdPromise.id,
        message: "success",
      };
    } catch (error) {
      console.log(error.message);
      return {
        message: "error",
      };
    }
  };
};
