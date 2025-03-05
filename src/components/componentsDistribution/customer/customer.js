import { Navigate } from "react-router-dom";
import { 
  Layout, 
  PageHeader, 
  Tabs, 
  Button, 
  Card, 
  Typography, 
  Space,
  Row,
  Col,
  Breadcrumb 
} from "antd";
import { 
  UserAddOutlined, 
  UnorderedListOutlined, 
  HomeOutlined, 
  TeamOutlined 
} from "@ant-design/icons";
import { useState } from "react";

import PageTitle from "../../page-header/PageHeader";
import AddCust from "./addCust";
import GetAllCust from "./getAllCust";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const Customer = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  const [activeTab, setActiveTab] = useState("1");

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout className="site-layout-background" style={{ minHeight: "100vh" }}>
      <PageTitle title="Gestion des Clients" subtitle="Vue d'ensemble des clients" />
      
      <Content style={{ padding: "0 24px 24px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Space>
              <HomeOutlined />
              <span>Accueil</span>
            </Space>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Space>
              <TeamOutlined />
              <span>Clients</span>
            </Space>
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <Card 
          className="shadow-sm" 
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Tabs 
            defaultActiveKey="1" 
            activeKey={activeTab}
            onChange={handleTabChange}
            size="large"
            type="card"
            tabBarStyle={{ marginBottom: 0, paddingLeft: 16, paddingRight: 16, paddingTop: 16 }}
            tabBarExtraContent={
              <Space>
                <Button 
                  type={activeTab === "1" ? "primary" : "default"} 
                  icon={<UnorderedListOutlined />}
                  onClick={() => setActiveTab("1")}
                >
                  Liste des clients
                </Button>
                <Button 
                  type={activeTab === "2" ? "primary" : "default"} 
                  icon={<UserAddOutlined />}
                  onClick={() => setActiveTab("2")}
                >
                  Ajouter un client
                </Button>
              </Space>
            }
          >
            <TabPane tab="Liste des clients" key="1">
              <div style={{ padding: "16px" }}>
                <GetAllCust />
              </div>
            </TabPane>
            <TabPane tab="Ajouter un client" key="2">
              <div style={{ padding: "16px" }}>
                <AddCust />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
      
      <style jsx>{`
        .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        
        .ant-tabs-nav-wrap {
          padding-left: 16px;
        }
        
        .ant-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .ant-tabs-tab {
          padding: 12px 16px !important;
        }
        
        .ant-breadcrumb {
          font-size: 14px;
        }
      `}</style>
    </Layout>
  );
};

export default Customer;