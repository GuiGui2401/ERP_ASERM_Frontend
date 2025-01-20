import supplierReducer from "./reducers/supplierReducer";
import productReducer from "./reducers/productReducer";
import purchaseReducer from "./reducers/purchaseReducer";
import userReducer from "./reducers/userReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import customerReducer from "./reducers/customerReducer";
import saleReducer from "./reducers/saleReducer";
import supplierPaymentReducer from "./reducers/supplierPaymentReducer";
import accountReducer from "./reducers/accountReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import transactionReducer from "./reducers/transactionReducer";
import productCategoryReducer from "./reducers/productCategoryReducer";
import designationReducer from "./reducers/designationReducer";


// import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer1 from "../reduxRessourceHumaine/rtk/features/dashboard/dashboardSlice";
import designationReducer1 from "../reduxRessourceHumaine/rtk/features/designation/designationSlice";
import userReducer1 from "../reduxRessourceHumaine/rtk/features/user/userSlice";
import payrollSlice from "../reduxRessourceHumaine/rtk/features/payroll/payrollSlice";
import paymentSlice from "../reduxRessourceHumaine/rtk/features/payment/paymentSlice";
import shiftSlice from "../reduxRessourceHumaine/rtk/features/shift/shiftSlice";
import employmentStatusSlice from "../reduxRessourceHumaine/rtk/features/employemntStatus/employmentStatusSlice";
import attendanceReducer from "../reduxRessourceHumaine/rtk/features/attendance/attendanceSlice";
import leaveSlice from "../reduxRessourceHumaine/rtk/features/leave/leaveSlice";
import accountSlice from "../reduxRessourceHumaine/rtk/features/account/accountSlice";
import transactionSlice from "../reduxRessourceHumaine/rtk/features/transaction/transactionSlice";
import announcementSlice from "../reduxRessourceHumaine/rtk/features/announcement/announcementSlice";
import awardSlice from "../reduxRessourceHumaine/rtk/features/award/awardSlice";
import awardHistorySlice from "../reduxRessourceHumaine/rtk/features/awardHistory/awardHistorySlice";
import leavePolicySlice from "../reduxRessourceHumaine/rtk/features/leavePolicy/leavePolicySlice";
import weeklyHolidaySlice from "../reduxRessourceHumaine/rtk/features/weeklyHoliday/weeklyHolidaySlice";
import publicHolidaySlice from "../reduxRessourceHumaine/rtk/features/publicHoliday/publicHolidaySlice";
import milestoneSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/milestone/milestone";
import projectTaskSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/projectTask/projectTask";
import projectTeamSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/projectTeam/projectTeam";
import taskDependencySlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/taskDependency/taskDependency";
import taskStatusSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/taskStatus/taskStatus";
import taskTimeSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/taskTime/taskTime";
import taskPrioritySlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/taskPriority/taskPriority";
import projectSlice from "../reduxRessourceHumaine/rtk/features/projectManagement/project/project/project";
import logsReducer from "./reducers/logsReducer";
import promiseSaleReducer from "./reducers/PromiseSaleReducer";
import reportingReducer from "./reducers/reportingReducer";

// const reduxLogger = require("redux-logger");
// const logger = reduxLogger.createLogger();

const store = createStore(
	combineReducers({
		suppliers: supplierReducer,
		products: productReducer,
		purchases: purchaseReducer,
		customers: customerReducer,
		sales: saleReducer,
		users: userReducer,
		supplierPayments: supplierPaymentReducer,
		accounts: accountReducer,
		dashboard: dashboardReducer,
		transactions: transactionReducer,
		productCategories: productCategoryReducer,
		designations: designationReducer,

		users1: userReducer1,
		dashboard1: dashboardReducer1,
		designations1: designationReducer1,
		payroll: payrollSlice,
		payment: paymentSlice,
		shift: shiftSlice,
		employmentStatus: employmentStatusSlice,
		attendance: attendanceReducer,
		leave: leaveSlice,
		accounts1: accountSlice,
		transactions1: transactionSlice,
		announcement: announcementSlice,
		award: awardSlice,
		awardHistory: awardHistorySlice,
		leavePolicy: leavePolicySlice,
		weeklyHoliday: weeklyHolidaySlice,
		publicHoliday: publicHolidaySlice,
		milestone: milestoneSlice,
		project: projectSlice,
		projectTask: projectTaskSlice,
		projectTeam: projectTeamSlice,
		taskDependency: taskDependencySlice,
		taskStatus: taskStatusSlice,
		taskTime: taskTimeSlice,
		taskPriority: taskPrioritySlice,

		logs: logsReducer,
		salePromises: promiseSaleReducer,
		reportings: reportingReducer

	}),

	composeWithDevTools(applyMiddleware(thunk))
);

export default store;
