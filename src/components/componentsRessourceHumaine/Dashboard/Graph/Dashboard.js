import { 
	Card, 
	Col, 
	Row, 
	Typography, 
	Space, 
	Avatar, 
	Badge, 
	Tooltip,
	Button,
	Divider,
	Tabs
  } from "antd";
  import React, { useState } from "react";
  import { Navigate } from "react-router-dom";
  import checkTokenExp from "../../../../utils/checkTokenExp";
  import { 
	CalendarOutlined, 
	NotificationOutlined, 
	LineChartOutlined,
	ClockCircleOutlined,
	TeamOutlined,
	SyncOutlined
  } from '@ant-design/icons';
  
  import PublicHolidayBar from "./PublicHolidayBar";
  import DemoLine from "./Demoline";
  import AnnouncementBar from "./AnnouncementBar";
  import "./Dashboard.css";
  
  const { Title, Text } = Typography;
  const { TabPane } = Tabs;
  
  const DashboardHR = () => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState('1');
  
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
			  <Title level={3} style={{ margin: 0 }}>Tableau de bord RH</Title>
			  <Text type="secondary">Gestion des ressources humaines</Text>
			</Space>
		  </Col>
		  <Col xs={24} md={12} style={{ textAlign: 'right' }}>
			<Space>
			  <Tooltip title="Rafraîchir les données">
				<Button 
				  type="text" 
				  icon={<SyncOutlined spin={isRefreshing} />} 
				  onClick={refreshData}
				>
				  Actualiser
				</Button>
			  </Tooltip>
			</Space>
		  </Col>
		</Row>
  
		{/* Graphique principal (heures de travail) */}
		<Card 
		  className="main-chart-card"
		  bodyStyle={{ padding: '24px' }}
		  style={{ marginBottom: '24px' }}
		>
		  <DemoLine />
		</Card>
  
		{/* Jours fériés et annonces */}
		<Row gutter={[24, 24]}>
		  <Col xs={24} lg={12}>
			<Card 
			  title={
				<Space>
				  <CalendarOutlined style={{ color: '#722ed1' }} />
				  <span>JOURS FÉRIÉS DE L'ANNÉE</span>
				</Space>
			  }
			  className="info-card"
			  extra={
				<Badge count={5} size="small">
				  <Text type="secondary">À venir</Text>
				</Badge>
			  }
			  bodyStyle={{ height: '450px', overflowY: 'auto' }}
			>
			  <PublicHolidayBar />
			</Card>
		  </Col>
  
		  <Col xs={24} lg={12}>
			<Card 
			  title={
				<Space>
				  <NotificationOutlined style={{ color: '#fa8c16' }} />
				  <span>ANNONCES</span>
				</Space>
			  }
			  className="info-card"
			  extra={
				<Badge count={3} size="small">
				  <Text type="secondary">Nouvelles</Text>
				</Badge>
			  }
			  bodyStyle={{ height: '450px', overflowY: 'auto' }}
			>
			  <AnnouncementBar />
			</Card>
		  </Col>
		</Row>
	  </div>
	);
  };
  
  export default DashboardHR;