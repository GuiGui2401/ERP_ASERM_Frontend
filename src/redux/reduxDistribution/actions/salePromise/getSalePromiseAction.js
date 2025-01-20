import { PROMISE_SALES } from "../../types/SalePromiseType";
import axios from "axios";
import { toast } from "react-toastify";

const formatDate = (date) => new Date(date).toISOString();

const getSalePromiseAction = (data) => {
  return {
    type: PROMISE_SALES,
    payload: data,
  };
};

export const loadAllSalePromise = ({ page, limit, startdate, enddate, user }) => {
  return async (dispatch) => {
    try {
      const formattedStartDate = formatDate(startdate);
      const formattedEndDate = formatDate(enddate);

      const { data } = await axios.get(
        `/sale-promise?page=${page}&count=${limit}&startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      );

      dispatch(getSalePromiseAction(data));
      return {
        message: "success",
      };
    } catch (error) {
      console.log(error.message);
      toast.error("Erreur de chargement des promesses d'achat");
    }
  };
};
