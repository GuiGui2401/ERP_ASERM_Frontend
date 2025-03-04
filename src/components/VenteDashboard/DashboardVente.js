import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  DatePicker, 
  Space, 
  Button, 
  Divider, 
  Statistic, 
  Tooltip 
} from "antd";
import { 
  DashboardOutlined, 
  ReloadOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  RiseOutlined,
  WalletOutlined,
  BankOutlined
} from "@ant-design/icons";

import { loadAllSale } from "../../redux/reduxDistribution/actions/sale/getSaleAction";
import { loadAllStaff } from "../../redux/reduxRessourceHumaine/rtk/features/user/userSlice";
import DashboardStatCard from "./DashboardStatCard";
import "../componentsDistribution/sale/sale.css";
import "./dashboard-vente.css"; // Nouveau fichier CSS pour les styles personnalisés

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const GetAllSale = () => {
  const dispatch = useDispatch();
  const total = useSelector((state) => state.sales.total);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month")
  ]);

  // Chargement initial des données
  useEffect(() => {
    dispatch(loadAllStaff({ status: true }));
    loadSalesData();
  }, []);

  // Fonction de chargement des données de vente
  const loadSalesData = () => {
    setLoading(true);
    dispatch(
      loadAllSale({
        page: 1,
        limit: 10,
        startdate: dateRange[0],
        enddate: dateRange[1],
        user: "",
      })
    ).finally(() => {
      setLoading(false);
    });
  };

  // Gestion du changement de dates
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      setLoading(true);
      dispatch(
        loadAllSale({
          page: 1,
          limit: 10,
          startdate: dates[0],
          enddate: dates[1],
          user: "",
        })
      ).finally(() => {
        setLoading(false);
      });
    }
  };

  // Vérification de la connexion
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Préparation des données de statistiques
  const invoiceCount = total?._count?.id || 0;
  const totalAmount = total?._sum?.total_amount || 0;
  const totalProfit = total?._sum?.profit || 0;
  const paidAmount = total?._sum?.paid_amount || 0;
  const dueAmount = total?._sum?.due_amount || 0;
  
  // Calcul du pourcentage payé
  const paymentPercentage = totalAmount > 0 
    ? Math.round((paidAmount / totalAmount) * 100) 
    : 0;

  // Configuration des cartes de statistiques
  const statCards = [
    {
      title: "Factures",
      value: invoiceCount,
      icon: <FileTextOutlined />,
      color: "#1890ff",
      prefix: "",
      suffix: ""
    },
    {
      title: "Montant total",
      value: totalAmount,
      icon: <DollarOutlined />,
      color: "#52c41a",
      prefix: "",
      suffix: " €"
    },
    {
      title: "Bénéfice total",
      value: totalProfit,
      icon: <RiseOutlined />,
      color: "#722ed1",
      prefix: "",
      suffix: " €"
    },
    {
      title: "Paiement",
      value: paidAmount,
      secondValue: dueAmount,
      secondTitle: "À payer",
      icon: <WalletOutlined />,
      color: "#fa8c16",
      prefix: "",
      suffix: " €",
      progress: paymentPercentage
    }
  ];

  return (
    <div className="sales-dashboard">
      {/* En-tête du tableau de bord */}
      <div className="dashboard-header">
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={0}>
              <Title level={3}>
                <DashboardOutlined /> Tableau de bord des ventes
              </Title>
              <Text type="secondary">
                Vue d'ensemble des performances de vente
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              <RangePicker 
                value={dateRange}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                allowClear={false}
                placeholder={["Date début", "Date fin"]}
                style={{ minWidth: '240px' }}
              />
              <Tooltip title="Actualiser les données">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  loading={loading}
                  onClick={loadSalesData}
                >
                  Actualiser
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Cartes de statistiques */}
      <div className="stat-cards-container">
        <Row gutter={[24, 24]}>
          {statCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <DashboardStatCard {...card} loading={loading} />
            </Col>
          ))}
        </Row>
      </div>

      {/* Espace pour des graphiques ou tableaux supplémentaires */}
      <Row gutter={[24, 24]} className="dashboard-content">
        <Col span={24}>
          <Card bordered={false} className="empty-content-card">
            <div className="empty-content-placeholder">
              <Space direction="vertical" align="center">
                <CalendarOutlined style={{ fontSize: '48px', opacity: 0.2 }} />
                <Text type="secondary">
                  Vous pouvez ajouter des graphiques ou des tableaux supplémentaires ici
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GetAllSale;