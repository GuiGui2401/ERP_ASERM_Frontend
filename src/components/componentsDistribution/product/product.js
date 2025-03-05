import React, { useState } from "react";
import { 
  Tabs, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Breadcrumb, 
  Row, 
  Col,
  Badge
} from "antd";
import { 
  PlusOutlined, 
  UnorderedListOutlined, 
  FormOutlined, 
  HomeOutlined, 
  ShopOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { Navigate, Link } from "react-router-dom";

import PageTitle from "../../page-header/PageHeader";
import AddProd from "./addProd";
import GetAllProd from "./getAllProd";
import "./product.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const Product = () => {
  const [activeTab, setActiveTab] = useState("1");
  
  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Gérer le changement d'onglet
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="product-container">
      <PageTitle title="Retour" subtitle="GESTION DES PRODUITS" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="product-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Accueil
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ShopOutlined /> Produits
        </Breadcrumb.Item>
      </Breadcrumb>
      
      {/* Carte principale */}
      <Card 
        className="product-card"
        title={
          <Space>
            <ShopOutlined className="card-icon" />
            <Title level={4} className="card-title">Gestion des produits</Title>
          </Space>
        }
        extra={
          <Space>
            <Button 
              type={activeTab === "1" ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => setActiveTab("1")}
            >
              Liste
            </Button>
            <Button 
              type={activeTab === "2" ? "primary" : "default"}
              icon={<PlusOutlined />}
              onClick={() => setActiveTab("2")}
            >
              Ajouter
            </Button>
          </Space>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="card"
          className="product-tabs"
          tabBarStyle={{ marginBottom: 24 }}
        >
          {/* Onglet Liste des produits */}
          <TabPane 
            tab={
              <span>
                <UnorderedListOutlined /> 
                Liste des produits
                <Badge 
                  count="9+" 
                  style={{ marginLeft: 8, fontSize: '10px', backgroundColor: '#52c41a' }} 
                  overflowCount={99}
                />
              </span>
            } 
            key="1"
          >
            <Row>
              <Col span={24}>
                <GetAllProd />
              </Col>
            </Row>
          </TabPane>
          
          {/* Onglet Ajouter un produit */}
          <TabPane 
            tab={
              <span>
                <FormOutlined /> 
                Ajouter un produit
              </span>
            } 
            key="2"
          >
            <Row>
              <Col span={24}>
                <AddProd />
              </Col>
            </Row>
          </TabPane>
          
          {/* Onglet Catégories (désactivé pour l'instant) */}
          <TabPane 
            tab={
              <span>
                <AppstoreOutlined /> 
                Catégories
              </span>
            } 
            key="3"
            disabled
          >
            <div>Gestion des catégories de produits</div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Product;