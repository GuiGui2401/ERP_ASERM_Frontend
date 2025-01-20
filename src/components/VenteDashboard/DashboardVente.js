import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";
import "../componentsDistribution/sale/sale.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSale } from "../../redux/reduxDistribution/actions/sale/getSaleAction";
import { loadAllStaff } from "../../redux/reduxRessourceHumaine/rtk/features/user/userSlice";
import DashboardCard from "../componentsDistribution/Card/DashboardCard";
import PageTitle from "../page-header/PageHeader";
const GetAllSale = (props) => {
  const dispatch = useDispatch();
  const total = useSelector((state) => state.sales.total);

  useEffect(() => {
    dispatch(loadAllStaff({ status: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      loadAllSale({
        page: 1,
        limit: 10,
        startdate: moment().startOf("month"),
        enddate: moment().endOf("month"),
        user: "",
      })
    );
  }, []);


  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <PageTitle subtitle={"PAGE D'ACCUEIL DE VENTE"}/>
      <div className="card card-custom mt-1">
        <div className="card-body">
          
          <DashboardCard
            information={total?._sum}
            count={total?._count}
            isCustomer={true}
          />
          <br />
          
        </div>
      </div>
    </>
  );
};

export default GetAllSale;
