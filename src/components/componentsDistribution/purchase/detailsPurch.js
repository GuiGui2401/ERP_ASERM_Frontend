import { 
	DeleteOutlined, 
	ShoppingCartOutlined,
	RollbackOutlined,
	PrinterOutlined,
	CalendarOutlined,
	UserOutlined,
	MoneyCollectOutlined,
	FileTextOutlined,
	DollarOutlined,
	WarningOutlined,
	InfoCircleOutlined
  } from "@ant-design/icons";
  import { 
	Badge, 
	Button, 
	Card, 
	Col, 
	Popover, 
	Row, 
	Typography, 
	Space,
	Divider,
	Descriptions,
	Tooltip,
	Alert,
	Statistic,
	Steps,
	Tag,
	Tabs
  } from "antd";
  import moment from "moment";
  import { Fragment, useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import { deletePurchase } from "../../../redux/reduxDistribution/actions/purchase/deletePurchaseAction";
  import { loadSinglePurchase } from "../../../redux/reduxDistribution/actions/purchase/detailPurchaseAction";
  import CardComponent from "../Card/card.components";
  import PurchaseProductListCard from "../Card/purchaseInvoice/PurchaseProductListCard";
  import ReturnPurchaseInvoiceList from "../Card/purchaseInvoice/ReturnPurchaseInvoiceList";
  import TransactionPurchaseList from "../Card/purchaseInvoice/TransactionPurchaseList";
  import PurchaseInvoice from "../Invoice/PurchaseInvoice";
  import Loader from "../../loader/loader";
  import "./details-purch.css";
  
  const { Title, Text, Paragraph } = Typography;
  const { Step } = Steps;
  const { TabPane } = Tabs;
  
  const DetailsPurch = () => {
	const { id } = useParams();
	let navigate = useNavigate();
  
	// États
	const [visible, setVisible] = useState(false);
	const [activeTab, setActiveTab] = useState('products');
  
	// Dispatch et sélecteur
	const dispatch = useDispatch();
	const purchase = useSelector((state) => state.purchases.purchase);
	const {
	  status,
	  totalPaidAmount,
	  totalReturnAmount,
	  dueAmount,
	  singlePurchaseInvoice,
	  returnPurchaseInvoice,
	  transactions,
	} = purchase ? purchase : {};
  
	// Supprimer une facture
	const onDelete = () => {
	  try {
		dispatch(deletePurchase(id));
		setVisible(false);
		toast.warning(`L'achat : ${singlePurchaseInvoice.id} a été supprimé`);
		return navigate("/purchaselist");
	  } catch (error) {
		console.log(error.message);
	  }
	};
  
	// Gérer la visibilité du popover de suppression
	const handleVisibleChange = (newVisible) => {
	  setVisible(newVisible);
	};
  
	// Chargement de la facture
	useEffect(() => {
	  dispatch(loadSinglePurchase(id));
	}, [id]);
  
	// Vérification de la connexion
	const isLogged = Boolean(localStorage.getItem("isLogged"));
	if (!isLogged) {
	  return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
  
	// Déterminer le statut de paiement et la couleur
	const getPaymentStatus = () => {
	  if (!singlePurchaseInvoice) return {};
	  
	  if (singlePurchaseInvoice.due_amount === 0) {
		return { text: "PAYÉ", color: "success" };
	  } else if (singlePurchaseInvoice.paid_amount === 0) {
		return { text: "NON PAYÉ", color: "error" };
	  } else {
		return { text: "PARTIELLEMENT PAYÉ", color: "warning" };
	  }
	};
  
	const paymentStatus = getPaymentStatus();
  
	return (
	  <div className="purchase-details-container">
		{/* En-tête */}
		<div className="purchase-header">
		  <Row gutter={[24, 16]} align="middle">
			<Col xs={24} md={12}>
			  <Space direction="vertical" size={4}>
				<Space align="center">
				  <Link to="/purchaselist">
					<Button icon={<ShoppingCartOutlined />} type="link">
					  Achats
					</Button>
				  </Link>
				  <Text type="secondary">/</Text>
				  <Text strong>Facture #{singlePurchaseInvoice?.id}</Text>
				</Space>
				
				<Title level={3} style={{ margin: 0 }}>
				  <Space>
					<FileTextOutlined />
					Détails de la facture
				  </Space>
				</Title>
			  </Space>
			</Col>
			
			<Col xs={24} md={12} style={{ textAlign: 'right' }}>
			  <Space wrap>
				<Link to={`/purchase/return/${id}`}>
				  <Button 
					type="default" 
					icon={<RollbackOutlined />}
					className="header-button"
				  >
					Retour de produit
				  </Button>
				</Link>
				
				<PurchaseInvoice data={singlePurchaseInvoice}>
				  <Button 
					type="default" 
					icon={<PrinterOutlined />}
					className="header-button"
				  >
					Imprimer
				  </Button>
				</PurchaseInvoice>
				
				<Popover
				  content={
					<div className="delete-confirm">
					  <Paragraph>
						Êtes-vous sûr de vouloir supprimer cette facture ?
					  </Paragraph>
					  <Button 
						type="primary" 
						danger 
						onClick={onDelete}
					  >
						Oui, supprimer
					  </Button>
					</div>
				  }
				  title={
					<Space>
					  <WarningOutlined style={{ color: '#ff4d4f' }} />
					  Confirmation de suppression
					</Space>
				  }
				  trigger="click"
				  open={visible}
				  onOpenChange={handleVisibleChange}
				>
				  <Button 
					type="danger" 
					icon={<DeleteOutlined />}
					className="header-button"
				  >
					Supprimer
				  </Button>
				</Popover>
			  </Space>
			</Col>
		  </Row>
		</div>
  
		{/* Contenu principal */}
		{singlePurchaseInvoice ? (
		  <div className="purchase-content">
			{/* Informations générales et statut */}
			<Row gutter={[24, 24]}>
			  <Col xs={24} lg={16}>
				<Card className="info-card">
				  <Row gutter={[24, 24]}>
					<Col xs={24} md={12}>
					  <div className="info-section">
						<Title level={5}>
						  <Space>
							<CalendarOutlined />
							Informations sur la facture
						  </Space>
						</Title>
						<Descriptions column={1} size="small" className="description-list">
						  <Descriptions.Item label="Date d'achat">
							<Text strong>{moment(singlePurchaseInvoice.date).format("DD/MM/YYYY HH:mm")}</Text>
						  </Descriptions.Item>
						  <Descriptions.Item label="Fournisseur">
							<Link to={`/supplier/${singlePurchaseInvoice.supplier.id}`} className="supplier-link">
							  {singlePurchaseInvoice.supplier.name}
							</Link>
						  </Descriptions.Item>
						  <Descriptions.Item label="Mémo fournisseur">
							{singlePurchaseInvoice.supplier_memo_no || "Non spécifié"}
						  </Descriptions.Item>
						  <Descriptions.Item label="Note">
							{singlePurchaseInvoice.note || "Aucune note"}
						  </Descriptions.Item>
						</Descriptions>
					  </div>
					</Col>
					
					<Col xs={24} md={12}>
					  <div className="info-section">
						<Title level={5}>
						  <Space>
							<MoneyCollectOutlined />
							Détails financiers
						  </Space>
						</Title>
						<Descriptions column={1} size="small" className="description-list">
						  <Descriptions.Item label="Montant total">
							<Text strong>{singlePurchaseInvoice.total_amount.toLocaleString('fr-FR')} €</Text>
						  </Descriptions.Item>
						  <Descriptions.Item label="Remise">
							{singlePurchaseInvoice.discount > 0 ? (
							  <Text strong>{singlePurchaseInvoice.discount.toLocaleString('fr-FR')} €</Text>
							) : (
							  <Text type="secondary">Aucune remise</Text>
							)}
						  </Descriptions.Item>
						  <Descriptions.Item label="Montant payé">
							<Text strong style={{ color: '#52c41a' }}>
							  {singlePurchaseInvoice.paid_amount.toLocaleString('fr-FR')} €
							</Text>
						  </Descriptions.Item>
						  <Descriptions.Item label="Montant à payer">
							{singlePurchaseInvoice.due_amount > 0 ? (
							  <Text strong type="danger">
								{singlePurchaseInvoice.due_amount.toLocaleString('fr-FR')} €
							  </Text>
							) : (
							  <Badge status="success" text="Entièrement payé" />
							)}
						  </Descriptions.Item>
						</Descriptions>
					  </div>
					</Col>
				  </Row>
				</Card>
			  </Col>
			  
			  <Col xs={24} lg={8}>
				<Card 
				  className="status-card"
				  title={
					<Space>
					  <InfoCircleOutlined />
					  Statut de la facture
					</Space>
				  }
				>
				  <div className="status-badge-container">
					<Badge.Ribbon text={paymentStatus.text} color={paymentStatus.color}>
					  <div className="status-content">
						<Space direction="vertical" size={16} style={{ width: '100%' }}>
						  <Row gutter={[16, 16]}>
							<Col span={12}>
							  <Statistic 
								title="Montant total payé" 
								value={totalPaidAmount || 0} 
								precision={2}
								suffix="€"
								valueStyle={{ color: '#52c41a' }}
								formatter={(value) => value.toLocaleString('fr-FR')}
							  />
							</Col>
							<Col span={12}>
							  <Statistic 
								title="Montant total retourné" 
								value={totalReturnAmount || 0} 
								precision={2}
								suffix="€"
								valueStyle={{ color: '#722ed1' }}
								formatter={(value) => value.toLocaleString('fr-FR')}
							  />
							</Col>
						  </Row>
						  
						  <Divider style={{ margin: '8px 0' }} />
						  
						  <Statistic 
							title="Montant à payer" 
							value={dueAmount || 0} 
							precision={2}
							suffix="€"
							valueStyle={{ 
							  color: dueAmount > 0 ? '#f5222d' : '#52c41a',
							  fontSize: '24px'
							}}
							formatter={(value) => value.toLocaleString('fr-FR')}
						  />
						  
						  {dueAmount > 0 && (
							<Link to={`/payment/supplier/${id}`}>
							  <Button 
								type="primary" 
								block
								icon={<DollarOutlined />}
							  >
								Effectuer un paiement
							  </Button>
							</Link>
						  )}
						</Space>
					  </div>
					</Badge.Ribbon>
				  </div>
				</Card>
			  </Col>
			</Row>
  
			{/* Onglets pour les différentes sections */}
			<Card className="tabs-card">
			  <Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				type="card"
				className="info-tabs"
			  >
				<TabPane 
				  tab={
					<Space>
					  <ShoppingCartOutlined />
					  Produits
					</Space>
				  } 
				  key="products"
				>
				  <PurchaseProductListCard list={singlePurchaseInvoice.purchaseInvoiceProduct} />
				</TabPane>
				
				<TabPane 
				  tab={
					<Space>
					  <RollbackOutlined />
					  Retours
					  {returnPurchaseInvoice && returnPurchaseInvoice.length > 0 && (
						<Badge count={returnPurchaseInvoice.length} style={{ backgroundColor: '#722ed1' }} />
					  )}
					</Space>
				  } 
				  key="returns"
				>
				  {returnPurchaseInvoice && returnPurchaseInvoice.length > 0 ? (
					<ReturnPurchaseInvoiceList list={returnPurchaseInvoice} />
				  ) : (
					<div className="empty-section">
					  <Alert
						message="Aucun retour"
						description="Cette facture n'a pas de produits retournés."
						type="info"
						showIcon
					  />
					</div>
				  )}
				</TabPane>
				
				<TabPane 
				  tab={
					<Space>
					  <DollarOutlined />
					  Transactions
					  {transactions && transactions.length > 0 && (
						<Badge count={transactions.length} style={{ backgroundColor: '#52c41a' }} />
					  )}
					</Space>
				  } 
				  key="transactions"
				>
				  {transactions && transactions.length > 0 ? (
					<TransactionPurchaseList list={transactions} />
				  ) : (
					<div className="empty-section">
					  <Alert
						message="Aucune transaction"
						description="Aucun paiement n'a été effectué pour cette facture."
						type="info"
						showIcon
					  />
					</div>
				  )}
				</TabPane>
			  </Tabs>
			</Card>
		  </div>
		) : (
		  <Card className="loading-card">
			<Loader />
		  </Card>
		)}
	  </div>
	);
  };
  
  export default DetailsPurch;