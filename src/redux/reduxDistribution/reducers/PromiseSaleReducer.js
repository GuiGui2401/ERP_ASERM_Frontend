import {
  PROMISE_SALES,
  ADD_SALE_PROMISE,
  ADD_PROMISE_SALE_ERROR,
  PROMISE_SALE_DETAILS,
  DELETE_PROMISE_SALE,
} from "../types/SalePromiseType";
import { message } from "antd";

const initialState = {
  list: null, // Initialise avec un tableau vide pour éviter les problèmes
  promiseSale: null,
  total: null,
};

const promiseSaleReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROMISE_SALES:
      return {
        ...state,
        list: action.payload.allPromiseSales, // Assurez-vous que le nom correspond à ce que vous renvoie le backend
        total: action.payload.aggregations,
      };

    case ADD_SALE_PROMISE:
      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      return { ...state, list };

    case PROMISE_SALE_DETAILS:
      return { ...state, promiseSale: action.payload };

    case DELETE_PROMISE_SALE:
      return {
        ...state,
        list: state.list.filter(
          (promiseSale) => promiseSale.id !== parseInt(action.payload, 10)
        ),
      };

    case ADD_PROMISE_SALE_ERROR:
      message.error(action.payload);
      return state;

    default:
      return state;
  }
};

export default promiseSaleReducer;
