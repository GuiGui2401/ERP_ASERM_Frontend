import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Typography,
	Space,
	Divider,
	Alert,
	Steps,
	Tooltip,
	Badge,
	Statistic,
	Result
  } from "antd";
  import {
	ShoppingCartOutlined,
	CalendarOutlined,
	UserOutlined,
	FileTextOutlined,
	SaveOutlined,
	InfoCircleOutlined,
	DollarOutlined
  } from "@ant-design/icons";
  
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
  import { addPurchase } from "../../../redux/reduxDistribution/actions/purchase/addPurchaseAction";
  import { loadSuppliers } from "../../../redux/reduxDistribution/actions/supplier/getSuppliersAction";
  import Products from "./Products";
  
  import moment from "moment";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import { loadSupplier } from "../../../redux/reduxDistribution/actions/supplier/detailSupplierAction";
  import "./add-purch.css";
  
  const { Title, Text, Paragraph } = Typography;
  const { Option } = Select;
  const { Step } = Steps;
  
  const AddPurch = () => {
	// États
	const [formData, setFormData] = useState({});
	const [date, setDate] = useState(moment());
	const [afterDiscount, setAfterDiscount] = useState(0);
	const [loader, setLoader] = useState(false);
	const [supplier, setSupplier] = useState(null);
	const [selectedProds, setSelectedProds] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [createdInvoiceId, setCreatedInvoiceId] = useState(null);
	const [totalDiscountPaidDue, setTotalDiscountPaidDue] = useState({
	  total: 0,
	  discount: 0,
	  afterDiscount: 0,
	  paid: 0,
	  due: 0,
	});
  
	// Hooks
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form] = Form.useForm();
  
	// Sélecteurs Redux
	const allSuppliers = useSelector((state) => state.suppliers.list);
	const allProducts = useSelector((state) => state.products.list);
  
	// Chargement initial des données
	useEffect(() => {
	  dispatch(loadSuppliers({ page: 1, limit: 100 }));
	  dispatch(loadProduct({ page: 1, limit: 100 }));
	}, []);
  
	// Activation du loader lors de la soumission
	const onClickLoading = () => {
	  setLoader(true);
	};
  
	// Soumission du formulaire
	const onFormSubmit = async () => {
	  const purchaseInvoiceProduct = selectedProds
		.filter(prod => prod && prod.selectedQty > 0)
		.map((prod) => {
		  return {
			product_id: prod.id,
			product_quantity: prod.selectedQty,
			product_purchase_price: prod.purchase_price,
		  };
		});
  
	  // Vérification des données avant soumission
	  if (!supplier) {
		toast.warning("Veuillez sélectionner un fournisseur");
		setLoader(false);
		return;
	  }
  
	  if (purchaseInvoiceProduct.length === 0) {
		toast.warning("Veuillez ajouter au moins un produit");
		setLoader(false);
		return;
	  }
  
	  try {
		const valueData = {
		  date: date,
		  paid_amount: totalDiscountPaidDue.paid,
		  discount: totalDiscountPaidDue.discount,
		  supplier_id: supplier,
		  purchaseInvoiceProduct,
		};
  
		const resp = await dispatch(addPurchase(valueData));
  
		if (resp.message === "success") {
		  form.resetFields();
		  setFormData({});
		  setAfterDiscount(0);
		  setLoader(false);
		  setCreatedInvoiceId(resp.createdInvoiceId);
		  setCurrentStep(2); // Avancer à l'étape de succès
		} else {
		  setLoader(false);
		}
	  } catch (error) {
		setLoader(false);
		console.log(error.message);
		toast.error("Erreur lors de l'achat");
	  }
	};
  
	// Mettre à jour les données du formulaire
	const updateFormData = () => {
	  const data = form.getFieldsValue();
  
	  const total = data.purchaseInvoiceProduct?.reduce((acc, p) => {
		const { product_quantity = 0, product_purchase_price = 0 } = p;
		acc += product_quantity * product_purchase_price;
		return acc;
	  }, 0) || 0;
  
	  data.total = total;
	  data.due = total - (data.paid_amount ?? 0) - (data.discount ?? 0);
  
	  setFormData(data);
	  
	  if (data.discount) {
		setAfterDiscount(total - (data.discount ?? 0));
	  } else {
		setAfterDiscount(0);
	  }
	};
  
	// Événements de sélection du fournisseur
	const onChange = () => {
	  updateFormData();
	};
  
	const onSelectChange = async (value) => {
	  updateFormData();
	  setSupplier(value);
	  const { data } = await dispatch(loadSupplier(value));
	};
  
	const onSearch = (value) => {
	  // Recherche de fournisseurs (peut être implémentée plus tard)
	};
  
	// Gestionnaires de produits
	const handleSelectedProds = (prodId, key) => {
	  const foundProd = allProducts.find((item) => item.id === prodId);
	  
	  if (foundProd) {
		let updatedSelectedProds = [...selectedProds];
		if (selectedProds[key]) {
		  updatedSelectedProds[key] = { ...foundProd, selectedQty: 1 };
		  setSelectedProds(updatedSelectedProds);
		} else {
		  setSelectedProds((prev) => [...prev, { ...foundProd, selectedQty: 1 }]);
		}
	  }
	};
  
	const handleSelectedProdsQty = (key, qty) => {
	  const updatedSelectedProds = selectedProds.map((prod, index) => {
		if (key === index) {
		  return { ...prod, selectedQty: qty };
		} 
		return prod;
	  });
	  setSelectedProds(updatedSelectedProds);
	};
  
	const handleSelectedProdsPurchasePrice = (key, purchasePrice) => {
	  const updatedSelectedProds = selectedProds.map((prod, index) => {
		if (key === index) {
		  return { ...prod, purchase_price: purchasePrice };
		}
		return prod;
	  });
	  setSelectedProds(updatedSelectedProds);
	};
  
	const handleDeleteProd = (key) => {
	  if (selectedProds[key]) {
		const updatedProds = selectedProds.filter((prod, index) => key !== index);
		setSelectedProds(updatedProds);
	  }
	};
  
	// Gestionnaires de remise et paiement
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
  
	// Mise à jour des totaux lorsque les produits changent
	useEffect(() => {
	  if (selectedProds.length > 0) {
		let total = 0;
		let afterDiscount = 0;
		let due = 0;
  
		selectedProds.forEach((prod) => {
		  if (prod && prod.purchase_price && prod.selectedQty) {
			total += prod.purchase_price * prod.selectedQty;
		  }
		});
  
		if (totalDiscountPaidDue.discount > 0) {
		  afterDiscount = total - totalDiscountPaidDue.discount;
		} else afterDiscount = total;
  
		if (totalDiscountPaidDue.paid > 0) {
		  due = afterDiscount - totalDiscountPaidDue.paid;
		} else due = afterDiscount;
  
		setTotalDiscountPaidDue((prev) => ({
		  ...prev,
		  total,
		  afterDiscount,
		  due,
		}));
	  }
	}, [selectedProds, totalDiscountPaidDue.paid, totalDiscountPaidDue.discount]);
  
	// Vérifier si tous les champs obligatoires sont remplis
	const isFormValid = () => {
	  return (
		supplier &&
		selectedProds.length > 0 &&
		selectedProds.some(prod => prod && prod.selectedQty > 0) &&
		totalDiscountPaidDue.paid !== undefined
	  );
	};
  
	// Navigation entre les étapes
	const nextStep = () => {
	  if (currentStep < 2) {
		setCurrentStep(currentStep + 1);
	  }
	};
  
	const prevStep = () => {
	  if (currentStep > 0) {
		setCurrentStep(currentStep - 1);
	  }
	};
  
	return (
	  <div className="add-purchase-container">
		<Steps
		  current={currentStep}
		  className="purchase-steps"
		  items={[
			{
			  title: 'Informations',
			  description: 'Fournisseur et date',
			  icon: <UserOutlined />
			},
			{
			  title: 'Produits',
			  description: 'Sélection des articles',
			  icon: <ShoppingCartOutlined />
			},
			{
			  title: 'Confirmation',
			  description: 'Facture créée',
			  icon: <SaveOutlined />
			},
		  ]}
		/>
  
		<Card className="purchase-form-card">
		  <Form
			form={form}
			name="purchase_form"
			onFinish={onFormSubmit}
			onFinishFailed={() => {
			  setLoader(false);
			}}
			layout="vertical"
			size="large"
			autoComplete="off"
		  >
			{currentStep === 0 && (
			  <div className="step-content">
				<div className="step-title">
				  <Title level={4}>
					<Space>
					  <UserOutlined />
					  Informations sur le fournisseur
					</Space>
				  </Title>
				  <Text type="secondary">
					Sélectionnez un fournisseur et spécifiez les détails de la facture
				  </Text>
				</div>
  
				<Row gutter={[24, 24]}>
				  <Col xs={24} md={12}>
					<Form.Item
					  label="Fournisseur"
					  name="supplier_id"
					  rules={[
						{
						  required: true,
						  message: "Veuillez sélectionner un fournisseur!",
						},
					  ]}
					>
					  <Select
						loading={!allSuppliers}
						showSearch
						placeholder="Sélectionner un fournisseur"
						optionFilterProp="children"
						onChange={onSelectChange}
						onSearch={onSearch}
						filterOption={(input, option) =>
						  option.children.toLowerCase().includes(input.toLowerCase())
						}
					  >
						{allSuppliers &&
						  allSuppliers.map((sup) => (
							<Option key={sup.id} value={sup.id}>
							  {sup.name}
							</Option>
						  ))}
					  </Select>
					</Form.Item>
  
					<Form.Item
					  label="Mémo fournisseur"
					  name="supplier_memo_no"
					>
					  <Input
						placeholder="Référence fournisseur"
						onChange={updateFormData}
						prefix={<FileTextOutlined />}
					  />
					</Form.Item>
				  </Col>
  
				  <Col xs={24} md={12}>
					<Form.Item
					  label="Date"
					  required
					>
					  <DatePicker
						onChange={(value) => setDate(value._d)}
						defaultValue={date}
						format={"YYYY-MM-DD"}
						style={{ width: "100%" }}
						className="date-picker"
					  />
					</Form.Item>
  
					<Form.Item
					  name="note"
					  label="Note"
					>
					  <Input.TextArea
						placeholder="Notes additionnelles"
						onChange={updateFormData}
						rows={4}
					  />
					</Form.Item>
				  </Col>
				</Row>
  
				<div className="step-actions">
				  <Button
					type="primary"
					onClick={nextStep}
					disabled={!supplier}
				  >
					Continuer
				  </Button>
				</div>
			  </div>
			)}
  
			{currentStep === 1 && (
			  <div className="step-content">
				<div className="step-title">
				  <Title level={4}>
					<Space>
					  <ShoppingCartOutlined />
					  Sélection des produits
					</Space>
				  </Title>
				  <Text type="secondary">
					Ajoutez les produits et spécifiez les quantités et prix
				  </Text>
				</div>
  
				<Row gutter={[24, 24]}>
				  <Col span={24} lg={16}>
					<Products
					  formData={formData}
					  setData={setFormData}
					  allProducts={allProducts}
					  selectedProds={selectedProds}
					  handleSelectedProds={handleSelectedProds}
					  handleSelectedProdsQty={handleSelectedProdsQty}
					  handleSelectedProdsPurchasePrice={handleSelectedProdsPurchasePrice}
					  handleDeleteProd={handleDeleteProd}
					/>
				  </Col>
  
				  <Col span={24} lg={8}>
					<Card className="summary-card">
					  <Title level={5}>
						<Space>
						  <InfoCircleOutlined />
						  Résumé de la commande
						</Space>
					  </Title>
					  
					  <div className="summary-content">
						<div className="summary-row">
						  <Text>Total:</Text>
						  <Text strong>{totalDiscountPaidDue.total.toLocaleString('fr-FR')} €</Text>
						</div>
						
						<div className="discount-section">
						  <div className="summary-row">
							<Text>Remise:</Text>
							<Form.Item
							  name="discount"
							  className="discount-input"
							>
							  <InputNumber
								type="number"
								onChange={handleDiscount}
								min={0}
								max={totalDiscountPaidDue.total}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
								parser={value => value.replace(/\s+/g, '')}
								addonAfter="€"
							  />
							</Form.Item>
						  </div>
						  
						  <div className="summary-row highlighted">
							<Text>Après remise:</Text>
							<Text strong>{totalDiscountPaidDue.afterDiscount.toLocaleString('fr-FR')} €</Text>
						  </div>
						</div>
						
						<div className="payment-section">
						  <div className="summary-row">
							<Text>Montant payé:</Text>
							<Form.Item
							  name="paid_amount"
							  className="payment-input"
							  rules={[
								{
								  required: true,
								  message: "Veuillez saisir le montant payé",
								},
							  ]}
							>
							  <InputNumber
								type="number"
								onChange={handlePaid}
								min={0}
								max={totalDiscountPaidDue.afterDiscount}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
								parser={value => value.replace(/\s+/g, '')}
								addonAfter="€"
							  />
							</Form.Item>
						  </div>
						  
						  <div className="summary-row highlighted">
							<Text>Montant à payer:</Text>
							<Text strong type={totalDiscountPaidDue.due > 0 ? "danger" : "secondary"}>
							  {totalDiscountPaidDue.due.toLocaleString('fr-FR')} €
							</Text>
						  </div>
						</div>
					  </div>
					</Card>
  
					<div className="step-actions">
					  <Space>
						<Button onClick={prevStep}>
						  Retour
						</Button>
						<Button
						  type="primary"
						  onClick={onClickLoading}
						  loading={loader}
						  disabled={!isFormValid()}
						  htmlType="submit"
						  icon={<SaveOutlined />}
						>
						  Facturer
						</Button>
					  </Space>
					</div>
				  </Col>
				</Row>
			  </div>
			)}
  
			{currentStep === 2 && (
			  <div className="step-content">
				<Result
				  status="success"
				  title="Facture créée avec succès!"
				  subTitle={`La facture #${createdInvoiceId} a été enregistrée dans le système.`}
				  extra={[
					<Button 
					  type="primary" 
					  key="view"
					  onClick={() => navigate(`/purchase/${createdInvoiceId}`)}
					>
					  Voir la facture
					</Button>,
					<Button 
					  key="new"
					  onClick={() => {
						setCurrentStep(0);
						setSelectedProds([]);
						setTotalDiscountPaidDue({
						  total: 0,
						  discount: 0,
						  afterDiscount: 0,
						  paid: 0,
						  due: 0,
						});
					  }}
					>
					  Créer une nouvelle facture
					</Button>,
				  ]}
				/>
			  </div>
			)}
		  </Form>
		</Card>
	  </div>
	);
  };
  
  export default AddPurch;