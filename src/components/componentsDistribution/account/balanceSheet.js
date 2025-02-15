import { Card } from "antd";
import React, { useEffect, useState } from "react";
import PageTitle from "../../page-header/PageHeader";
import { getBalanceSheet } from "./account.api";

const BalanceSheet = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		const getData = async () => {
			const dataFromServer = await getBalanceSheet();
			setData(dataFromServer);
		};
		getData();
	}, []);

	return (
		<>
			<PageTitle title={"Retour"} subtitle="ETAT DU COMMERCE" />
			<br />
			<Card>
				<div>
					<div className='card-title d-flex justify-content-between'>
						<h5>
							<span className='ms-2 report-section-card-title'>
							Bilan
							</span>
						</h5>
					</div>

					<table className='table report-section-table'>
						<h5 className='mt-2 mb-2 font-weight-bold'> Assets</h5>
						<thead className='thead-dark'>
							<tr>
								<th scope='col'>compte</th>
								<th scope='col'>montant</th>
							</tr>
						</thead>
						<tbody>
							{data &&
								data?.assets.map((item, index) => {
									return (
										<tr>
											<td>{item.subAccount}</td>
											<td>{item.balance}</td>
										</tr>
									);
								})}

							<tr className='table-active'>
								<td>
									{" "}
									<strong>TOTAL</strong>
								</td>
								<td>
									<strong>{data?.totalAsset}</strong>
								</td>
							</tr>

							<h5 className='mt-2 mb-2 font-weight-bold'> Passifs </h5>

							{data &&
								data?.liabilities.map((item, index) => {
									return (
										<tr>
											<td>{item.subAccount}</td>
											<td>{item.balance}</td>
										</tr>
									);
								})}

							<tr className='table-active'>
								<td>
									<strong>TOTAL</strong>
								</td>
								<td>
									<strong>{data?.totalLiability}</strong>
								</td>
							</tr>

							<h5 className='mt-2 mb-2 font-weight-bold'> Équité </h5>

							{data &&
								data?.equity.map((item, index) => {
									return (
										<tr>
											<td>{item.subAccount}</td>
											<td>{item.balance}</td>
										</tr>
									);
								})}

							<tr className='table-active'>
								<td>
									{" "}
									<strong>TOTAL</strong>
								</td>
								<td>
									<strong>{data?.totalEquity}</strong>
								</td>
							</tr>
							<tr className='table-active'>
								<td>
									{" "}
									<strong>Total Passifs et Équité</strong>
								</td>
								<td>
									<strong>{data?.totalEquity + data?.totalLiability}</strong>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Card>
		</>
	);
};

export default BalanceSheet;
