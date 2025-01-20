import { DELETE_REPORT } from "../../types/ReportingType"; 
import axios from "axios";

const deleteReportAction = (id) => {
  return {
    type: DELETE_REPORT,
    payload: id,
  };
};

export const deleteReport = (id) => {
  return async (dispatch) => {
    try {
      await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `report/${id}`,
        data: {
          status: false,
        },
      });
      dispatch(deleteReportAction(id));
    } catch (error) {
      console.log(error.message);
    }
  };
};
