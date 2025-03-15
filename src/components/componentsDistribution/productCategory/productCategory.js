import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { 
  Card, 
  Tabs, 
  Typography, 
  Space, 
  Breadcrumb, 
  Badge,
  Divider
} from "antd";
import { 
  AppstoreOutlined, 
  PlusOutlined, 
  HomeOutlined,
  DatabaseOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";

import PageTitle from "../../page-header/PageHeader";
import AddProductCategory from "./addProductCategory";
import GetAllProductCategory from "./getAllProductCategory";
import "./productCategory.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const ProductCategory = () => {
  const [activeTab, setActiveTab] = useState("1");
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="product-category-container">
      <PageTitle title="Retour" subtitle="GESTION DES MARQUES" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="product-category-breadcrumb">
        <Breadcrumb.Item>
          <a href="/dashboard">
            <HomeOutlined /> Accueil
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/products">
            <DatabaseOutlined /> Produits
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <AppstoreOutlined /> Marques
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <Card 
        className="category-card"
        title={
          <Space>
            <AppstoreOutlined className="card-icon" />
            <Title level={4} className="card-title">Gestion des Marques de produits</Title>
          </Space>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="card"
          className="category-tabs"
        >
          <TabPane 
            tab={
              <span>
                <UnorderedListOutlined /> 
                Liste des Marques
                <Badge 
                  count="New" 
                  size="small" 
                  offset={[5, -3]} 
                  style={{ backgroundColor: '#52c41a' }}
                />
              </span>
            } 
            key="1"
          >
            <GetAllProductCategory />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <PlusOutlined /> 
                Ajouter une Marque
              </span>
            } 
            key="2"
          >
            <AddProductCategory />
          </TabPane>
        </Tabs>
        
        <Divider className="category-divider" />
        
        <div className="category-footer">
          <Space direction="vertical" size={0} align="center">
            <Typography.Text type="secondary">
              Organisez vos produits efficacement avec des Marques bien définies
            </Typography.Text>
            <Typography.Text type="secondary">
              Une bonne structure de Marques améliore l'expérience utilisateur et facilite la recherche
            </Typography.Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ProductCategory;