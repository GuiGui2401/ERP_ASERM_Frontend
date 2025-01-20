// actions/report/getReportAction.js
import { REPORTS } from "../../types/ReportingType";
import axios from "axios";

const getReports = (data) => {
  return {
    type: REPORTS,
    payload: data,
  };
};

export const loadAllReports = ({ page, limit, status }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `reporting/all?status=${status}&page=${page}&count=${limit}`
      );
      dispatch(getReports(data));
    } catch (error) {
      console.log(error.message);
    }
  };
};
