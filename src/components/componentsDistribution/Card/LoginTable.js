import React from "react";
import { Table, Card, Typography, Space, Tag, Tooltip, Button } from "antd";
import { UserOutlined, KeyOutlined, CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./login-table.css";

const { Text, Title } = Typography;

const LoginTable = () => {
  // Sample user credentials data
  const users = [
    {
      key: "1",
      username: "staff",
      password: "staff",
      type: "Staff",
      permissions: "Limité"
    },
    {
      key: "2",
      username: "admin",
      password: "admin",
      type: "Administrateur",
      permissions: "Complet"
    }
  ];

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const columns = [
    {
      title: (
        <Space>
          <UserOutlined />
          Nom d'utilisateur
        </Space>
      ),
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <Space>
          <Text strong>{text}</Text>
          <Tooltip title="Copier le nom d'utilisateur">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(text)}
              className="copy-button"
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <KeyOutlined />
          Mot de passe
        </Space>
      ),
      dataIndex: "password",
      key: "password",
      render: (text) => (
        <Space>
          <Text code>{text}</Text>
          <Tooltip title="Copier le mot de passe">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(text)}
              className="copy-button"
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Tag color={text === "Administrateur" ? "red" : "blue"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (text) => (
        <Tag color={text === "Complet" ? "green" : "orange"}>
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <Card className="login-table-card">
      <Title level={5} className="login-table-title">
        Comptes de démonstration
      </Title>
      
      <div className="login-notice">
        <Text type="secondary">
          <InfoCircleOutlined className="info-icon" />
          Ces informations de connexion sont uniquement pour la démonstration. 
          Dans un environnement de production, utilisez des identifiants sécurisés.
        </Text>
      </div>
      
      <Table 
        dataSource={users} 
        columns={columns} 
        pagination={false}
        className="credentials-table"
        size="middle"
        bordered
      />
      
      <div className="table-footer">
        <Text type="secondary">
          Cliquez sur l'icône <CopyOutlined /> pour copier dans le presse-papiers
        </Text>
      </div>
    </Card>
  );
};

export default LoginTable;