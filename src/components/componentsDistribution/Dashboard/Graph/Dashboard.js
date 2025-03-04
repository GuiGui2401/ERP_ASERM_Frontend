import { 
	Card, 
	Col, 
	Row, 
	Typography, 
	Space, 
	Divider, 
	Statistic, 
	Tooltip,
	DatePicker
  } from "antd";
  import React, { useState } from "react";
  import { Navigate } from "react-router-dom";
  import checkTokenExp from "../../../../utils/checkTokenExp";
  import { 
	LineChartOutlined, 
	PieChartOutlined, 
	BarChartOutlined,
	CalendarOutlined,
	ReloadOutlined
  } from '@ant-design/icons';
  
  import DemoBar from "./DemoBar";
  import DemoLine from "./Demoline";
  import DemoPie from "./DemoPie";
  import './Dashboard.css'
  
  const { Title, Text } = Typography;
  const { RangePicker } = DatePicker;
  
  const Dashboard = () => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));
	const [isRefreshing, setIsRefreshing] = useState(false);
  
	// Fonction pour simuler un rafraîchissement des données
	const refreshData = () => {
	  setIsRefreshing(true);
	  setTimeout(() => setIsRefreshing(false), 1000);
	};
  
	if (!isLogged) {
	  return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
  
	// Vérification de l'expiration du token
	const accessToken = localStorage.getItem("access-token");
	checkTokenExp(accessToken);
  
	return (
	  <div className="dashboard-container">
		{/* En-tête du tableau de bord */}
		<Row gutter={[24, 24]} align="middle" className="dashboard-header">
		  <Col xs={24} md={12}>
			<Space direction="vertical" size={0}>
			  <Title level={3} style={{ margin: 0 }}>Tableau de bord des ventes</Title>
			  <Text type="secondary">Visualisation des données de vente et d'achat</Text>
			</Space>
		  </Col>
		  <Col xs={24} md={12} style={{ textAlign: 'right' }}>
			<Space>
			  <Tooltip title="Rafraîchir les données">
				<ReloadOutlined 
				  onClick={refreshData} 
				  spin={isRefreshing}
				  style={{ fontSize: '18px', cursor: 'pointer' }}
				/>
			  </Tooltip>
			</Space>
		  </Col>
		</Row>
  
		{/* Section des graphiques */}
		<div className="dashboard-content">
		  {/* Graphique principal (tendances) */}
		  <Card 
			className="main-chart-card"
			bodyStyle={{ padding: '24px' }}
			style={{ marginBottom: '24px' }}
		  >
			<DemoLine />
		  </Card>
  
		  {/* Graphiques secondaires */}
		  <Row gutter={[24, 24]}>
			<Col xs={24} lg={12}>
			  <Card 
				title={
				  <Space>
					<PieChartOutlined style={{ color: '#1890ff' }} />
					<span>Ventes contre Achats</span>
				  </Space>
				}
				className="chart-card"
				bodyStyle={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			  >
				<DemoPie />
			  </Card>
			</Col>
  
			<Col xs={24} lg={12}>
			  <Card 
				title={
				  <Space>
					<BarChartOutlined style={{ color: '#52c41a' }} />
					<span>Clients les plus acheteurs</span>
				  </Space>
				}
				className="chart-card"
				bodyStyle={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			  >
				<DemoBar />
			  </Card>
			</Col>
		  </Row>
		</div>
	  </div>
	);
  };
  
  export default Dashboard;