import { REPORT_DETAILS } from "../../types/ReportingType";
import axios from "axios";

const detailReport = (data) => {
  return {
    type: REPORT_DETAILS,
    payload: data,
  };
};

export const loadSingleReport = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`report/${id}`);
      dispatch(detailReport(data));
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
};
