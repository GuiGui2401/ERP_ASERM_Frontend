import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	InputNumber,
	Input,
	Row,
	Select,
	Typography,
} from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCustomer } from "../../../redux/reduxDistribution/actions/customer/getCustomerAction";
import { addSalePromise } from "../../../redux/reduxDistribution/actions/salePromise/addSalePromiseAction";
import Products from "./Products";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;

const AddSalePromise = ({
	selectedProds,
	handleSelectedProdsQty,
	handleDeleteProd,
	handleSelectedProdsUnitPrice,
}) => {
	const currentUserId = parseInt(localStorage.getItem("id"));
	const { Option } = Select;
	const [loader, setLoader] = useState(false);
	const navigate = useNavigate();

	const [date, setDate] = useState(moment());
	const [afterDiscount, setAfterDiscount] = useState(0);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAllCustomer({ page: 1, limit: 10 }));
	}, [dispatch]);

	const allCustomer = useSelector((state) => state.customers.list);
	const allProducts = useSelector((state) => state.products.list);
	const [customer, setCustomer] = useState(null);
	const [isDisabled, setIsDisabled] = useState(false);
	const [formData, setFormData] = useState({});
	const [isRegisteredCustomer, setIsRegisteredCustomer] = useState(true); // Gérer client enregistré ou non
	const [totalDiscountPaidDue, setTotalDiscountPaidDue] = useState({
		total: 0,
		discount: 0,
		afterDiscount: 0,
		paid: 0,
		due: 0,
	});

	const handleDiscount = (discountAmount) => {
		const afterDiscount = totalDiscountPaidDue.total - discountAmount;
		let dueAmount = totalDiscountPaidDue.total - discountAmount;
		if (totalDiscountPaidDue.paid > 0) {
			dueAmount = dueAmount - totalDiscountPaidDue.paid;
		}
		setTotalDiscountPaidDue((prev) => ({
			...prev,
			discount: discountAmount,
			due: dueAmount,
			afterDiscount,
		}));
	};

	const handlePaid = (paidAmount) => {
		const dueAmount = totalDiscountPaidDue.afterDiscount - paidAmount;
		setTotalDiscountPaidDue((prev) => ({
			...prev,
			paid: paidAmount,
			due: dueAmount,
		}));
	};

	const [form] = Form.useForm();

	const [dueDate, setDueDate] = useState(null);  // Pour la date d'échéance
	const [reminderDate, setReminderDate] = useState(null);  // Pour la date de rappel
	const [customerAddress, setCustomerAddress] = useState("");

	const onFormSubmit = async (values) => {
		const salePromiseProduct = selectedProds.map((prod) => {
			return {
				product_id: prod.id,
				product_quantity: prod.selectedQty,
				product_sale_price: prod.sale_price,
			};
		});

		try {
			const valueData = {
				date: new Date().toString(),
				dueDate: dueDate ? new Date(dueDate).toString() : null,  // Date d'échéance
				reminderDate: reminderDate ? new Date(reminderDate).toString() : null,  // Date de rappel
				companyName: values.company_name,  // Nom de l'entreprise
				customer_address: !isRegisteredCustomer ? customerAddress : null,
				paid_amount: totalDiscountPaidDue.paid,
				discount: totalDiscountPaidDue.discount,
				customer_id: isRegisteredCustomer ? customer : null, // Si le client est enregistré
				customer_name: !isRegisteredCustomer ? values.customer_name : null, // Si non enregistré
				customer_phone: !isRegisteredCustomer ? values.customer_phone : null, // Si non enregistré
				user_id: currentUserId,
				promiseSaleInvoiceProduct: [...salePromiseProduct],
			};
			const resp = await dispatch(addSalePromise(valueData));

			if (resp.message === "success") {
				form.resetFields();
				setFormData({});
				setAfterDiscount(0);
				setLoader(false);
				navigate(`/salePromiseList`);
			} else {
				setLoader(false);
			}
		} catch (error) {
			console.log(error.message);
			setLoader(false);
			toast.error("Erreur lors de l'enregistrement de la promesse de vente");
		}
	};

	return (
		<Card className='mt-3'>
			<Form
				form={form}
				className='m-lg-1'
				layout='vertical'
				size='large'
				autoComplete='off'
				onFinish={onFormSubmit}>
				<Row gutter={[24, 24]}>
					{/* Formulaire pour saisir les détails de la promesse de vente */}

					<Col span={24}>
						{/* Sélection du client ou saisie des infos */}
						<Form.Item label="Type de client">
							<Select
								defaultValue="registered"
								onChange={(value) => setIsRegisteredCustomer(value === "registered")}>
								<Option value="registered">Client enregistré</Option>
								<Option value="unregistered">Client non enregistré</Option>
							</Select>
						</Form.Item>

						{isRegisteredCustomer ? (
							<Form.Item label='Client' name='customer_id'>
								<Select
									showSearch
									placeholder='Sélectionner un client'
									optionFilterProp='children'
									onChange={setCustomer}
									loading={!allCustomer}>
									{allCustomer &&
										allCustomer.map((cust) => (
											<Option key={cust.id} value={cust.id}>
												{cust.phone} - {cust.name}
											</Option>
										))}
								</Select>
							</Form.Item>
						) : (
							<>
								<Form.Item
									name='customer_name'
									label='Nom du client non enregistré'
									rules={[{ required: true, message: 'Veuillez entrer un nom' }]}>
									<Input />
								</Form.Item>
								<Form.Item
									name='customer_phone'
									label='Téléphone du client non enregistré'
									rules={[
										{ required: true, message: 'Veuillez entrer un numéro de téléphone' },
									]}>
									<Input />
								</Form.Item>
								<Form.Item
									name='customer_address'
									label='Adresse du client non enregistré'
									rules={[{ required: true, message: 'Veuillez entrer une adresse' }]}>
									<Input onChange={(e) => setCustomerAddress(e.target.value)} />
								</Form.Item>
							</>
						)}
					</Col>

					{/* Champ Date d'échéance et Date de rappel, toujours affiché */}
					<Col span={24}>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Date d'échéance">
									<DatePicker
										onChange={(date) => setDueDate(date)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Date de rappel">
									<DatePicker
										onChange={(date) => setReminderDate(date)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Products
							formData={formData}
							setData={setFormData}
							allProducts={allProducts}
							selectedProds={selectedProds}
							handleSelectedProdsQty={handleSelectedProdsQty}
							handleSelectedProdsUnitPrice={handleSelectedProdsUnitPrice}
							handleDeleteProd={handleDeleteProd}
						/>
					</Col>

					<Col span={24}>
						<Form.Item style={{ marginTop: "15px" }}>
							<Button
								block
								type='primary'
								htmlType='submit'
								loading={loader}>
								Promesse d'achat
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};

export default AddSalePromise;
