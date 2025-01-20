import { Line } from "@ant-design/plots";
import { Card, Col, DatePicker, Row } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewDashboardCard1 from "../../Card/Dashboard/NewDashboardCard";
import Loader from "../../../loader/loader";
import { loadDashboardData } from "../../../../redux/reduxRessourceHumaine/rtk/features/dashboard/dashboardSlice";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";
import AttendancePopup from "../..//UI/PopUp/AttendancePopup";

dayjs.extend(utc);
//Date fucntinalities
let startdate = dayjs(new Date()).startOf("month").format("YYYY-MM-DD");
let enddate = dayjs(new Date()).endOf("month").format("YYYY-MM-DD");

const DemoLine = () => {
	const data = useSelector((state) => state.dashboard.list?.workHoursByDate);

	const cardInformation = useSelector((state) => state.dashboard.list);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadDashboardData({ startdate, enddate }));
	}, []);

	const { RangePicker } = DatePicker;

	const onCalendarChange = (dates) => {
		startdate = (dates?.[0]).format("YYYY-MM-DD");
		enddate = (dates?.[1]).format("YYYY-MM-DD");

		dispatch(loadDashboardData({ startdate, enddate }));
	};

	const config = {
		data,
		xField: "date",
		yField: "time",
		seriesField: "type",
		yAxis: {
			label: {
				formatter: (v) => `${v / 1000} Hours`,
			},
		},
		legend: {
			position: "top",
		},
		smooth: true,
		animation: {
			appear: {
				animation: "path-in",
				duration: 5000,
			},
		},
	};

	return (
		<Fragment>
			<UserPrivateComponent permission={"ReadDashboardHR"}>
				
				<NewDashboardCard1 information={cardInformation} />

				<Card title='HEURES DE TRAVAIL'>
					{data ? <Line {...config} /> : <Loader />}
				</Card>
			</UserPrivateComponent>
		</Fragment>
	);
};

export default DemoLine;
