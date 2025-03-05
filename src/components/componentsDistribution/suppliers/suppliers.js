import React, { createContext } from "react";
import { Layout, Row, Col, Breadcrumb, Space, Typography } from "antd";
import { HomeOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import PageTitle from "../../page-header/PageHeader";
import AddSup from "./addSup";
import GetAllSup from "./getAllSup";

const { Content } = Layout;
const { Title, Text } = Typography;

export const SuppliersContext = createContext();

const Suppliers = () => {
  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <Layout className="site-layout">
      <Content className="site-layout-background" style={{ padding: '0 24px', minHeight: 280 }}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={24}>
              <PageTitle title="Retour" subtitle={"GESTION DES FOURNISSEURS"} />
              
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item>
                  <Link to="/dashboard">
                    <Space>
                      <HomeOutlined />
                      <span>Accueil</span>
                    </Space>
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Space>
                    <TeamOutlined />
                    <span>Fournisseurs</span>
                  </Space>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
        
        <div className="site-layout-content">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div className="page-introduction" style={{ marginBottom: 24 }}>
                <Title level={4}>
                  <UserOutlined /> Gestion des fournisseurs
                </Title>
                <Text type="secondary">
                  Cette section vous permet d'ajouter de nouveaux fournisseurs, de consulter la liste de vos fournisseurs existants,
                  et de gérer toutes les informations relatives à vos partenaires commerciaux.
                </Text>
              </div>
            </Col>
            
            <Col span={24}>
              <AddSup />
            </Col>
            
            <Col span={24}>
              <GetAllSup />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Suppliers;