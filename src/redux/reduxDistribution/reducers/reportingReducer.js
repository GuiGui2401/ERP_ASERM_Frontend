import {
    REPORTS,
    ADD_REPORT,
    ADD_REPORT_ERROR,
    REPORT_DETAILS,
    DELETE_REPORT,
  } from "../types/ReportingType";
  import { message } from "antd";
  
  const initialState = {
    list: null,
    report: null,
  };
  
  const reportingReducer = (state = initialState, action) => {
    switch (action.type) {
      case REPORTS:
        return { ...state, list: action.payload };
  
      case ADD_REPORT:
        if (!Array.isArray(state.list)) {
          state.list = [];
        }
        const newList = [...state.list];
        newList.push(action.payload);
        return { ...state, list: newList };
  
      case REPORT_DETAILS:
        return { ...state, report: action.payload.data };
  
      case DELETE_REPORT:
        const filteredReports = state.list.filter(
          (rep) => rep.id !== parseInt(action.payload)
        );
        return { ...state, list: filteredReports };
  
      case ADD_REPORT_ERROR:
        message.error(action.payload);
        return state;
  
      default:
        return state;
    }
  };
  
  export default reportingReducer;
  