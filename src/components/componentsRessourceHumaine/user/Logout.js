import { 
  Button, 
  Card, 
  Col, 
  Form, 
  Input, 
  Row, 
  Typography, 
  Divider, 
  Space,
  Alert
} from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined,
  SafetyOutlined 
} from "@ant-design/icons";
import React, { useState } from "react";
import styles from "./Login.module.css";

import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/reduxRessourceHumaine/rtk/features/user/userSlice";

import { toast } from "react-toastify";
import logo from "../../../assets/images/logoaserm.png";

const Login = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { Title, Text } = Typography;

  const onFinish = async (values) => {
    setLoader(true);
    setLoginError(null);
    
    try {
      const resp = await dispatch(addUser(values));
      if (resp.payload.message === "success") {
        setLoader(false);
        window.location.href = "/dashboardglobal";
      } else {
        setLoader(false);
        setLoginError("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (error) {
      setLoader(false);
      setLoginError("Erreur de connexion. Veuillez réessayer plus tard.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoader(false);
    toast.error("Erreur de connexion. Veuillez réessayer");
  };

  return (
    <div className={styles.loginContainer}>
      <Row justify="center" align="middle" className={styles.loginRow}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card 
            bordered={false} 
            className={styles.loginCard}
            bodyStyle={{ padding: "32px 24px" }}
          >
            <div className={styles.logoContainer}>
              <img
                src={logo}
                alt="logo"
                className={styles.logoImage}
              />
            </div>
            
            <Title level={3} className={styles.welcomeTitle}>
              BIENVENUE !
            </Title>
            
            <Text type="secondary" className={styles.welcomeSubtitle}>
              Connectez-vous pour accéder à votre compte
            </Text>
            
            <Divider />
            
            {loginError && (
              <Alert
                message={loginError}
                type="error"
                showIcon
                className={styles.loginAlert}
                closable
                onClose={() => setLoginError(null)}
              />
            )}
            
            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className={styles.loginForm}
              requiredMark={false}
            >
              <Form.Item
                label="Nom d'utilisateur"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nom d'utilisateur",
                  },
                ]}
              >
                <Input 
                  size="large"
                  prefix={<UserOutlined className={styles.inputIcon} />} 
                  placeholder="Entrez votre nom d'utilisateur" 
                />
              </Form.Item>

              <Form.Item
                label="Mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre mot de passe",
                  },
                ]}
              >
                <Input.Password 
                  size="large"
                  prefix={<LockOutlined className={styles.inputIcon} />} 
                  placeholder="Entrez votre mot de passe" 
                />
              </Form.Item>

              <Form.Item className={styles.actionItem}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loader}
                  icon={<LoginOutlined />}
                  size="large"
                  block
                  className={styles.loginButton}
                >
                  Connexion
                </Button>
              </Form.Item>
            </Form>
            
            <Divider>
              <Text type="secondary">Information</Text>
            </Divider>
            
            <div className={styles.securityInfo}>
              <Space align="start">
                <SafetyOutlined className={styles.securityIcon} />
                <Text type="secondary">
                  En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;