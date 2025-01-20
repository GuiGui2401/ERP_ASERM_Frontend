import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

import DetailsSup from "./components/componentsDistribution/suppliers/detailsSup";
import Suppliers from "./components/componentsDistribution/suppliers/suppliers";
import UpdateSup from "./components/componentsDistribution/suppliers/updateSup";

import DetailsProd from "./components/componentsDistribution/product/detailsProd";
import Product from "./components/componentsDistribution/product/product";
import UpdateProd from "./components/componentsDistribution/product/updateProd";
import GetAllProd from "./components/componentsDistribution/product/getAllProd";

import DetailsPurch from "./components/componentsDistribution/purchase/detailsPurch";
import Purchase from "./components/componentsDistribution/purchase/purchase";

import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Customer from "./components/componentsDistribution/customer/customer";
import DetailCust from "./components/componentsDistribution/customer/detailCust";
import UpdateCust from "./components/componentsDistribution/customer/updateCust";
import Pos from "./components/componentsDistribution/pos/pos";

import DetailSale from "./components/componentsDistribution/sale/detailSale";
import Sale from "./components/componentsDistribution/sale/sale";
import SalePromise from "./components/componentsDistribution/sale/salePromise";

import Dashboard from "./components/componentsDistribution/Dashboard/Graph/Dashboard";
import AddCustPaymentByInvoice from "./components/componentsDistribution/Payment/CustomerPaymentByInvoice";
import AddSupPaymentByInvoice from "./components/componentsDistribution/Payment/SupplierPaymentByInvoice";
import GetAllPurch from "./components/componentsDistribution/purchase/getAllPurch";
import GetAllSale from "./components/componentsDistribution/sale/getAllSale";
import GetAllSalePromise from "./components/componentsDistribution/sale/getAllSalePromise";

// import Register from "./components/user/Register";
import { Layout } from "antd";
import Account from "./components/componentsDistribution/account/account";
import BalanceSheet from "./components/componentsDistribution/account/balanceSheet";
import DetailAccount from "./components/componentsDistribution/account/detailAccount";
import IncomeStatement from "./components/componentsDistribution/account/incomeStatement";
import TrialBalance from "./components/componentsDistribution/account/trialBalance";

import DetailProductCategory from "./components/componentsDistribution/productCategory/detailProductCategory";
import ProductCategory from "./components/componentsDistribution/productCategory/productCategory";
import UpdateProductCategory from "./components/componentsDistribution/productCategory/updateProductCategory";
import AddReturnPurchase from "./components/componentsDistribution/purchase/addReturnPurchase";
import AddReturnSale from "./components/componentsDistribution/sale/addReturnSale";
import AddTransaction from "./components/componentsDistribution/transaction/AddTransaction";
import DetailTransaction from "./components/componentsDistribution/transaction/detailTransaction";
import Transaction from "./components/componentsDistribution/transaction/transaction";

import Page404 from "./components/404/404Page";
import Main from "./components/layouts/Main";
import InvoiceSetting from "./components/settings/invoiceSetting";

import DashboardGlobal from "./components/GlobalDashboard/DashboardGlobal.js";
import DashboardVente from "./components/VenteDashboard/DashboardVente.js";

// import AddPermission from "./components/role/AddPermission";
// import DetailRole from "./components/role/DetailsRole";
// import RoleList from "./components/role/role";

// import Designation from "./components/designation/designation";
// import DetailDesignation from "./components/designation/detailDesignation";
// import UpdateDesignation from "./components/designation/updateDesignation";

import DashboardHR from "./components/componentsRessourceHumaine/Dashboard/Graph/Dashboard";

import UserPrivateRoute from "./components/componentsRessourceHumaine/PrivateRoutes/UserPrivateRoute";

import Login from "./components/componentsRessourceHumaine/user/Login";
import Logout from "./components/componentsRessourceHumaine/user/Logout";
import UserList from "./components/componentsRessourceHumaine/user/user";
import DetailStaff from "./components/componentsRessourceHumaine/user/detailsStaff";
import GetAllUsers from "./components/componentsRessourceHumaine/user/GetAllUser";

import Designation from "./components/componentsRessourceHumaine/designation/designation";
import DetailDesignation from "./components/componentsRessourceHumaine/designation/detailDesignation";
import UpdateDesignation from "./components/componentsRessourceHumaine/designation/updateDesignation";

import RoleList from "./components/componentsRessourceHumaine/role/role";
import AddPermission from "./components/componentsRessourceHumaine/role/AddPermission";
import DetailRole from "./components/componentsRessourceHumaine/role/DetailsRole";

import Department from "./components/componentsRessourceHumaine/department/Department.js";
import DetailDepartment from "./components/componentsRessourceHumaine/department/DetailsDepartment";

import CalculatePayroll from "./components/componentsRessourceHumaine/payroll/CalculatePayroll";
import PayslipList from "./components/componentsRessourceHumaine/payroll/PayslipList";
import DetailPayslip from "./components/componentsRessourceHumaine/payroll/PayslipDetail";

import Shift from "./components/componentsRessourceHumaine/shift/Shift";
import DetailShift from "./components/componentsRessourceHumaine/shift/ShiftDetails";

import EmploymentStatus from "./components/componentsRessourceHumaine/employmentStatus/EmploymentStatus";
import DetailEmploymentStatus from "./components/componentsRessourceHumaine/employmentStatus/EmploymentStatusDetails";

import Attendance from "./components/componentsRessourceHumaine/attendance/AddAttendance";
import DetailAttendance from "./components/componentsRessourceHumaine/attendance/DetailAttendance";
import UserAttendance from "./components/componentsRessourceHumaine/attendance/UserAttendance";

import Leave from "./components/componentsRessourceHumaine/leave/Leave";
import GetAllLeaves from "./components/componentsRessourceHumaine/leave/GetAllLeaves";
import DetailLeave from "./components/componentsRessourceHumaine/leave/DetailLeave";
import UserLeave from "./components/componentsRessourceHumaine/leave/UserLeave";

import Announcement from "./components/componentsRessourceHumaine/announcement/Announcement";
import DetailAnnouncement from "./components/componentsRessourceHumaine/announcement/AnnouncementDetails";

import LeavePolicy from "./components/componentsRessourceHumaine/leavePolicy/LeavePolicy";
import DetailLeavePolicy from "./components/componentsRessourceHumaine/leavePolicy/DetailsLeavePolicy";

import Award from "./components/componentsRessourceHumaine/award/Award";
import DetailAward from "./components/componentsRessourceHumaine/award/DetailsAward";
import AddAward from "./components/componentsRessourceHumaine/award/AddAward";
import GetAllAward from "./components/componentsRessourceHumaine/award/GetAllAward";

import WeeklyHoliday from "./components/componentsRessourceHumaine/weeklyHoliday/WeeklyHoliday";
import DetailWeeklyHoliday from "./components/componentsRessourceHumaine/weeklyHoliday/DetailsWeeklyHoliday";

import PublicHoliday from "./components/componentsRessourceHumaine/publicHoliday/PublicHoliday";
import DetailPublicHoliday from "./components/componentsRessourceHumaine/publicHoliday/DetailsPublicHoliday";

import Project from "./components/componentsRessourceHumaine/project/project";
import AddProject from "./components/componentsRessourceHumaine/project/AddProject";
import UpdateProject from "./components/componentsRessourceHumaine/project/UpdateProject";

import Milestone from "./components/componentsRessourceHumaine/project/milestone/milestone";
import UpdateMilestone from "./components/componentsRessourceHumaine/project/milestone/UpdateMilestone";

import TaskStatus from "./components/componentsRessourceHumaine/project/taskStatus/taskStatus";
import UpdateTaskStatus from "./components/componentsRessourceHumaine/project/taskStatus/UpdateTaskStatus";

import TaskPriority from "./components/componentsRessourceHumaine/project/taskPriority/taskPriority";
import UpdateTaskPriority from "./components/componentsRessourceHumaine/project/taskPriority/UpdateTaskPriority";

import DetailProjectTeam from "./components/componentsRessourceHumaine/project/team/DetailProjectTeam";
import ProjectTeam from "./components/componentsRessourceHumaine/project/team/ProjectTeam";

import Task from "./components/componentsRessourceHumaine/project/tasks/tasks";

import UpdateStatus from "./components/componentsRessourceHumaine/project/UpdateStatus";
import KanbanBoard2 from "./components/componentsRessourceHumaine/kanbanBoard/KanbanBoard2";
import MapPage from "./components/componentsDistribution/Map/MapPage.js";

import ReportingTable from "./components/componentsDistribution/reporting/getAllReport";

// import UserList from "./components/user/user";
// import DetailStaff from "./components/user/detailsStaff";
// import UpdateStaff from "./components/user/updateStaff";

import { ModuleProvider } from './components/layouts/ModuleContext';
import DetailReport from "./components/componentsDistribution/reporting/detailReport.js";

const { Sider } = Layout;

function App() {
  return (
    <div className="App container-fluid">
      <BrowserRouter>
      <ModuleProvider>
        <Main>
          <ToastContainer />
          <Routes>
            <Route path="/mappage" element={<MapPage />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />

            <Route path="/dashboardglobal" element={<DashboardGlobal />}></Route>
            <Route path="/dashboardvente" element={<DashboardVente />}></Route>

            <Route path="/supplier" exact element={<Suppliers />} />
            <Route path="/supplier/:id" element={<DetailsSup />} />
            <Route path="/supplier/:id/update" element={<UpdateSup />} />

            <Route path="/product" exact element={<Product />} />
            <Route path="/product/:id" element={<DetailsProd />} />
            <Route path="/product/:id/update" element={<UpdateProd />} />
            <Route path="/productlist" exact element={<GetAllProd />} />

            <Route path="/reportings" element={<ReportingTable />} />
            <Route path="/reportings/:id" element={<DetailReport />} />

            <Route
              path="/product-category"
              exact
              element={<ProductCategory />}
            />
            <Route
              path="/product-category/:id"
              element={<DetailProductCategory />}
            />
            <Route
              path="/product-category/:id/update"
              element={<UpdateProductCategory />}
            />

            <Route path="/purchase" exact element={<Purchase />} />
            <Route path="/purchaselist" exact element={<GetAllPurch />} />
            <Route path="/purchase/:id" element={<DetailsPurch />} />
            <Route
              path="/purchase/return/:id"
              element={<AddReturnPurchase />}
            />

            <Route path="/customer" exact element={<Customer />} />
            <Route path="/customer/:id" element={<DetailCust />} />
            <Route path="/customer/:id/update" element={<UpdateCust />} />

            <Route path="/sale" exact element={<Sale />} />
            <Route path="/salelist" exact element={<GetAllSale />} />
            <Route path="/salepromise" exact element={<SalePromise />} />
            <Route path="/salepromiselist" exact element={<GetAllSalePromise />} />
            <Route path="/sale/:id" element={<DetailSale />} />
            <Route path="/sale/:id/update" element={<UpdateProd />} />
            <Route path="/sale/return/:id" element={<AddReturnSale />} />
            <Route
              path="/payment/supplier/:pid"
              exact
              element={<AddSupPaymentByInvoice />}
            />
            <Route
              path="/payment/customer/:pid"
              exact
              element={<AddCustPaymentByInvoice />}
            />
            <Route path="/transaction" exact element={<Transaction />} />
            <Route
              path="/transaction/create"
              exact
              element={<AddTransaction />}
            />
            <Route path="/transaction/:id" element={<DetailTransaction />} />

            <Route path="/account" exact element={<Account />} />
            <Route path="/account/:id" element={<DetailAccount />} />
            <Route
              path="/account/trial-balance"
              exact
              element={<TrialBalance />}
            />
            <Route
              path="/account/balance-sheet"
              exact
              element={<BalanceSheet />}
            />
            <Route path="/account/income" exact element={<IncomeStatement />} />
            <Route path="/pos" exact element={<Pos />} />
            <Route path="/invoice-setting" exact element={<InvoiceSetting />} />

            <Route path="/admin/auth/login" exact element={<Login />} />
            <Route path="/admin/auth/logout" exact element={<Logout />} />
			<Route
              element={<UserPrivateRoute permission={"ReadDashboardHR"} />}
            >
            <Route path="/admin/dashboard" element={<DashboardHR />}></Route>
			</Route>
			
            <Route
              element={<UserPrivateRoute permission={"readSingle-user"} />}
            >
              <Route
                path="/admin/hr/staffs/:id"
                exact
                element={<DetailStaff />}
              />
            </Route>
            <Route
              element={
                <UserPrivateRoute permission={"readAll-rolePermission"} />
              }
            >
              <Route path="/admin/role" exact element={<RoleList />} />
              <Route element={<UserPrivateRoute permission={"createUser"} />}>
                <Route
                  path="/admin/hr/staffs/new"
                  exact
                  element={<UserList />}
                />
              </Route>
              <Route element={<UserPrivateRoute permission={"viewUser"} />}>
                <Route
                  path="/admin/hr/staffs"
                  exact
                  element={<GetAllUsers />}
                />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"readSingle-user"} />}
              >
                <Route
                  path="/admin/hr/staffs/:id"
                  exact
                  element={<DetailStaff />}
                />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-rolePermission"} />
                }
              >
                <Route path="/admin/role" exact element={<RoleList />} />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-rolePermission"} />
                }
              >
                <Route path="/admin/role/:id" element={<DetailRole />} />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"create-rolePermission"} />
                }
              >
                <Route
                  path="/admin/role/permit/:id/"
                  element={<AddPermission />}
                />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"readAll-department"} />}
              >
                <Route
                  path="/admin/department"
                  exact
                  element={<Department />}
                />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-department"} />
                }
              >
                <Route
                  path="/admin/department/:id"
                  element={<DetailDepartment />}
                />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-designation"} />
                }
              >
                <Route
                  path="/admin/designation"
                  exact
                  element={<Designation />}
                />
              </Route>

              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-designation"} />
                }
              >
                <Route
                  path="/admin/designation/:id"
                  element={<DetailDesignation />}
                />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"update-designation"} />}
              >
                <Route
                  path="/admin/designation/:id/update"
                  element={<UpdateDesignation />}
                />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"readAll-setting"} />}
              >
                <Route
                  path="/admin/company-setting"
                  exact
                  element={<InvoiceSetting />}
                />
              </Route>

              {/* === === === Payroll Routes === === === */}
              <Route
                element={<UserPrivateRoute permission={"readAll-payroll"} />}
              >
                <Route
                  path="/admin/payroll/new"
                  element={<CalculatePayroll />}
                />
                <Route path="/admin/payroll/list" element={<PayslipList />} />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"readSingle-payroll"} />}
              >
                <Route path="/admin/payroll/:id" element={<DetailPayslip />} />
              </Route>

              {/* === === === Shift Routes === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-shift"} />}
              >
                <Route path="/admin/shift" element={<Shift />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"readSingle-shift"} />}
              >
                <Route path="/admin/shift/:id" element={<DetailShift />} />
              </Route>

              {/* === === === EmploymentStatus Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-employmentStatus"} />
                }
              >
                <Route
                  path="/admin/employment-status"
                  element={<EmploymentStatus />}
                />
              </Route>

              <Route
                element={
                  <UserPrivateRoute
                    permission={"readSingle-employmentStatus"}
                  />
                }
              >
                <Route
                  path="/admin/employment-status/:id"
                  element={<DetailEmploymentStatus />}
                />
              </Route>

              {/* === === === Leave Routes === === === */}

              <Route
                element={
                  <UserPrivateRoute permission={"create-leaveApplication"} />
                }
              >
                <Route path="/admin/leave/new" element={<Leave />} />
              </Route>
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-leaveApplication"} />
                }
              >
                <Route path="/admin/leave/:id" element={<DetailLeave />} />
                <Route path="/admin/leave" element={<GetAllLeaves />} />
              </Route>
              <Route
                element={
                  <UserPrivateRoute
                    permission={"readSingle-leaveApplication"}
                  />
                }
              >
                <Route path="/admin/leave/user/:id" element={<UserLeave />} />
              </Route>
              {/* === === === Attendance Routes === === === */}
              <Route
                element={<UserPrivateRoute permission={"readAll-attendance"} />}
              >
                <Route path="/admin/attendance" element={<Attendance />} />
              </Route>

              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-attendance"} />
                }
              >
                <Route
                  path="/admin/attendance/user/:id"
                  element={<UserAttendance />}
                />
              </Route>
              {/*<Route
							path='/admin/attendance/:id'
							element={<DetailAttendance />}
						/> */}

              {/* === === === Accounting Routes === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-account"} />}
              >
                <Route path="/admin/account" exact element={<Account />} />
                <Route path="/admin/account/:id" element={<DetailAccount />} />
                <Route
                  path="/admin/account/trial-balance"
                  exact
                  element={<TrialBalance />}
                />
                <Route
                  path="/admin/account/balance-sheet"
                  exact
                  element={<BalanceSheet />}
                />
                <Route
                  path="/admin/account/income"
                  exact
                  element={<IncomeStatement />}
                />
              </Route>
              {/* === === === Transaction Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-transaction"} />
                }
              >
                <Route
                  path="/admin/transaction"
                  exact
                  element={<Transaction />}
                />
              </Route>

              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-transaction"} />
                }
              >
                <Route
                  path="/admin/transaction/:id"
                  element={<DetailTransaction />}
                />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"create-transaction"} />}
              >
                <Route
                  path="/admin/transaction/create"
                  exact
                  element={<AddTransaction />}
                />
              </Route>

              {/* === === === Announcement Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-announcement"} />
                }
              >
                <Route
                  path="/admin/announcement"
                  exact
                  element={<Announcement />}
                />
              </Route>

              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-announcement"} />
                }
              >
                <Route
                  path="/admin/announcement/:id"
                  element={<DetailAnnouncement />}
                />
              </Route>

              {/* === === === Award Routes === === === */}

              <Route element={<UserPrivateRoute permission={"create-award"} />}>
                <Route path="/admin/award/new" exact element={<AddAward />} />
              </Route>
              <Route
                element={<UserPrivateRoute permission={"readAll-award"} />}
              >
                <Route path="/admin/award/:id" element={<DetailAward />} />
                <Route path="/admin/award" exact element={<GetAllAward />} />
              </Route>

              {/* === === === Leave Policy Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-leavePolicy"} />
                }
              >
                <Route
                  path="/admin/leave-policy"
                  exact
                  element={<LeavePolicy />}
                />
                <Route
                  path="/admin/leave-policy/:id"
                  element={<DetailLeavePolicy />}
                />
              </Route>

              {/* === === === Weekly Holiday Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-weeklyHoliday"} />
                }
              >
                <Route
                  path="/admin/holiday/week"
                  exact
                  element={<WeeklyHoliday />}
                />
                <Route
                  path="/admin/holiday/week/:id"
                  element={<DetailWeeklyHoliday />}
                />
              </Route>
              {/* === === === Public Holiday Routes === === === */}
              <Route
                element={
                  <UserPrivateRoute permission={"readAll-publicHoliday"} />
                }
              >
                <Route
                  path="/admin/holiday/public"
                  exact
                  element={<PublicHoliday />}
                />
                <Route
                  path="/admin/holiday/public/:id"
                  element={<DetailPublicHoliday />}
                />
              </Route>

              {/* === === === === PROJECT MANAGEMENT STARTED HERE === === === ===*/}

              {/* === === === Kanban Routes === === === */}
              <Route
                element={<UserPrivateRoute permission={"readSingle-project"} />}
              >
                <Route
                  path="/admin/kanban/:projectId"
                  element={<KanbanBoard2 />}
                />
              </Route>
              {/* <Route
							path='/admin/kanban2/:projectId'
							element={<KanbanBoard2 />}
						/>
 */}
              {/* === === === Project Routes === === === */}
              <Route
                element={<UserPrivateRoute permission={"readAll-project"} />}
              >
                <Route path="/admin/project" element={<Project />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"create-project"} />}
              >
                <Route path="/admin/project/new" element={<AddProject />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"update-project"} />}
              >
                <Route
                  path="/admin/project/update/:projectId"
                  element={<UpdateProject />}
                />
              </Route>

              <Route
                path="/admin/project/update/:projectId/status"
                element={<UpdateStatus />}
              />

              {/* === === === Project Milestone === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-project"} />}
              >
                <Route
                  path="/admin/project/:id/milestone"
                  element={<Milestone isFixed={true} />}
                />
              </Route>

              {/* === === === Project Task Status === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-project"} />}
              >
                <Route
                  path="/admin/project/:id/task-status"
                  element={<TaskStatus isFixed={true} />}
                />
              </Route>

              {/* === === === Team Routes === === === */}

              <Route
                element={
                  <UserPrivateRoute permission={"readAll-projectTeam"} />
                }
              >
                <Route path="/admin/team" element={<ProjectTeam />} />
              </Route>

              <Route
                element={
                  <UserPrivateRoute permission={"readSingle-projectTeam"} />
                }
              >
                <Route path="/admin/team/:id" element={<DetailProjectTeam />} />
              </Route>
              {/* <Route path='/admin/team/update/:id' element={<DetailProjectTeam />} /> */}

              {/* === === === Milestone Routes === === === */}

              <Route
                element={<UserPrivateRoute permission={"create-milestone"} />}
              >
                <Route path="/admin/milestone" element={<Milestone />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"update-milestone"} />}
              >
                <Route
                  path="/admin/milestone/update/:id"
                  element={<UpdateMilestone />}
                />
              </Route>

              {/* <Route path="/admin/milestone/:id" element={<DetailProject />} /> */}

              <Route element={<UserPrivateRoute permission={"create-task"} />}>
                <Route path="/admin/task" element={<Task />} />
              </Route>

              {/* === === === TaskStatus Routes === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-taskStatus"} />}
              >
                <Route path="/admin/task-status" element={<TaskStatus />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"update-taskStatus"} />}
              >
                <Route
                  path="/admin/task-status/update/:id"
                  element={<UpdateTaskStatus />}
                />
              </Route>

              {/* === === === TaskPriority Routes === === === */}

              <Route
                element={<UserPrivateRoute permission={"readAll-priority"} />}
              >
                <Route path="/admin/task-priority" element={<TaskPriority />} />
              </Route>

              <Route
                element={<UserPrivateRoute permission={"update-priority"} />}
              >
                <Route
                  path="/admin/task-priority/update/:id"
                  element={<UpdateTaskPriority />}
                />
              </Route>
            </Route>
          </Routes>
        </Main>
        </ModuleProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
