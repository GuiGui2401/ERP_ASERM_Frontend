import { DeleteOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Popover, Row, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardComponent from "../Card/card.components";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";

import { loadSingleSale } from "../../../redux/reduxDistribution/actions/sale/detailSaleAction";

import { deleteSale } from "../../../redux/reduxDistribution/actions/sale/deleteSaleAction";
import ReturnSaleInvoiceList from "../Card/saleInvoice/ReturnSaleInvoiceList";
import SaleProductListCard from "../Card/saleInvoice/SaleProductListCard";
import TransactionSaleList from "../Card/saleInvoice/TransactionSaleList";
import PackingSlip from "../Invoice/PackingSlip";
import PosPrint from "../Invoice/PosPrint";
import SaleInvoice from "../Invoice/SaleInvoice";
import moment from "moment";
//PopUp

const DetailSale = () => {
	const { id } = useParams();
	let navigate = useNavigate();

	//dispatch
	const dispatch = useDispatch();
	const sale = useSelector((state) => state.sales.sale);
	const {
		status,
		totalPaidAmount,
		totalReturnAmount,
		dueAmount,
		singleSaleInvoice,
		returnSaleInvoice,
		transactions,
		totalUnitMeasurement,
	} = sale ? sale : {};

	//Delete Customer
	const onDelete = () => {
		try {
			dispatch(deleteSale(id));

			setVisible(false);
			toast.warning(`La vente : ${sale.id} est supprimée `);
			return navigate("/salelist");
		} catch (error) {
			console.log(error.message);
		}
	};
	// Delete Customer PopUp
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	useEffect(() => {
		dispatch(loadSingleSale(id));
	}, [id]);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}

	return (
		<div>
			<PageTitle title='Retour' />

			<div className='mr-top'>
				{singleSaleInvoice ? (
					<Fragment key={singleSaleInvoice.id}>
						<Card bordered={false} className='card-custom'>
							<h5 className='m-2'>
								<i className='bi bi-person-lines-fill'></i>
								<span className='mr-left'>ID : {singleSaleInvoice.id} |</span>
							</h5>
							<div className='card-header d-flex justify-content-center '>
								<div className='me-2'>
									<Link to={`/sale/return/${id}`}>
										<Button type='primary' shape='round'>
											{" "}
											Retour de produit{" "}
										</Button>
									</Link>
								</div>
								<div className='me-2'>
									<Popover
										content={
											<a onClick={onDelete}>
												<Button type='primary' danger>
													Oui
												</Button>
											</a>
										}
										title='Voulez-vous vraiment supprimer ?'
										trigger='click'
										open={visible}
										onOpenChange={handleVisibleChange}>
										<Button
											type='danger'
											DetailCust
											shape='round'
											icon={<DeleteOutlined />}>Supprimer</Button>
									</Popover>
								</div>
								<div className={"text-end me-2"}>
									<SaleInvoice data={singleSaleInvoice} />
								</div>
								<div className={"text-end me-2"}>
									<PackingSlip data={singleSaleInvoice} />
								</div>
								<div className={"text-end me-2"}>
									<PosPrint data={singleSaleInvoice} />
								</div>
							</div>
							<div className='card-body'>
								<Row justify='space-around'>
									<Col span={11}>
										<CardComponent title='Informations sur la facture initiale '>
											<div className='d-flex justify-content-between'>
												<div>
													<p>
														<Typography.Text strong>
														Date de vente :
														</Typography.Text>{" "}
														<strong>
															{moment(singleSaleInvoice.date).format("DD/MM/YY HH:mm")}
														</strong>
													</p>
													<p>
														<Typography.Text strong>
														Client :{" "}
														</Typography.Text>{" "}
														<Link
															to={`/customer/${singleSaleInvoice.customer.id}`}>
															<strong>{singleSaleInvoice.customer.name}</strong>
														</Link>
													</p>

													<p>
														<Typography.Text strong>
														Type de client :{" "}
														</Typography.Text>{" "}
															<strong>{singleSaleInvoice.customer.type_customer}</strong>
													</p>

													<p>
														<Typography.Text strong>
														Montant total :
														</Typography.Text>{" "}
														<strong>{singleSaleInvoice.total_amount}</strong>
													</p>
													<p>
														<Typography.Text strong>Remise :</Typography.Text>{" "}
														<strong>{singleSaleInvoice.discount}</strong>
													</p>
													<p>
														<Typography.Text strong>
														Montant payé :
														</Typography.Text>{" "}
														<strong>{singleSaleInvoice.paid_amount}</strong>
													</p>
													<p>
														<Typography.Text strong>
														Montant à payer :
														</Typography.Text>{" "}
														<strong style={{ color: "red" }}>
															{" "}
															{singleSaleInvoice.due_amount}
														</strong>
													</p>
													<p>
														<Typography.Text strong>Bénéfice :</Typography.Text>{" "}
														<strong>{singleSaleInvoice.profit}</strong>
													</p>
												</div>

												<div className='me-2'></div>
											</div>
										</CardComponent>
									</Col>
									<Col span={12}>
										<Badge.Ribbon
											text={status}
											color={status === "PAYÉ" ? "green" : "red"}>
											<CardComponent title='Mise à jour des informations sur la facture '>
												<div>
													<p>
														<Typography.Text strong>
														Montant total payé :
														</Typography.Text>{" "}
														<strong>{totalPaidAmount}</strong>
													</p>

													<p>
														<Typography.Text strong>
														Montant total du retour:
														</Typography.Text>{" "}
														<strong>{totalReturnAmount}</strong>
													</p>

													<p>
														<Typography.Text strong>
														Montant à payer :
														</Typography.Text>{" "}
														<strong style={{ color: "red" }}>
															{dueAmount}
														</strong>
													</p>
													{/* <p>
														<Typography.Text strong>
															Total Unit Messurement :
														</Typography.Text>{" "}
														<strong>{totalUnitMeasurement}</strong>
													</p> */}
												</div>
											</CardComponent>
										</Badge.Ribbon>
									</Col>
								</Row>

								<br />
							</div>
						</Card>
						<SaleProductListCard list={singleSaleInvoice.saleInvoiceProduct} />

						<ReturnSaleInvoiceList list={returnSaleInvoice} />

						{/* <TransactionSaleList list={transactions} /> */}
					</Fragment>
				) : (
					<Loader />
				)}
			</div>
		</div>
	);
};

export default DetailSale;
