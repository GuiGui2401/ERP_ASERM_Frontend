import { 
	ArrowLeftOutlined, 
	ShoppingCartOutlined, 
	FileTextOutlined 
  } from "@ant-design/icons";
  import { Card, Layout, Typography, Space, Breadcrumb } from "antd";
  import { Navigate, Link } from "react-router-dom";
  import AddPurch from "./addPurch";
  import "./purchase.css";
  
  const { Content } = Layout;
  const { Title, Text } = Typography;
  
  const Purchase = () => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));
  
	if (!isLogged) {
	  return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
  
	return (
	  <Layout className="purchase-layout">
		<Content className="purchase-content">
		  {/* En-tête de la page */}
		  <div className="page-header">
			<div className="header-content">
			  <div className="header-title">
				<Title level={3}>
				  <Space>
					<ShoppingCartOutlined />
					Nouvelle facture d'achat
				  </Space>
				</Title>
				<Text type="secondary">
				  Créer une nouvelle facture d'achat et ajouter des produits
				</Text>
			  </div>
			  
			  <Breadcrumb className="breadcrumb-path">
				<Breadcrumb.Item>
				  <Link to="/dashboard">
					<Space>
					  <FileTextOutlined />
					  Dashboard
					</Space>
				  </Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
				  <Link to="/purchaselist">
					<Space>
					  <FileTextOutlined />
					  Liste des achats
					</Space>
				  </Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Nouvel achat</Breadcrumb.Item>
			  </Breadcrumb>
			</div>
		  </div>
  
		  {/* Contenu principal */}
		  <div className="purchase-container">
			<AddPurch />
		  </div>
		</Content>
	  </Layout>
	);
  };
  
  export default Purchase;