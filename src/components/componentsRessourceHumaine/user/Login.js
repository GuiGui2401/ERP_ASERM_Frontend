import { Button, Card, Col, Form, Input, Row, Typography, Select } from "antd";
import React, { useState } from "react";
import styles from "./Login.module.css";

import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/reduxRessourceHumaine/rtk/features/user/userSlice";

import { toast } from "react-toastify";
import LoginTable from "../Card/LoginTable";
import logo from "../../../assets/images/logoaserm.png";
const Login = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const { Title } = Typography;

  const onFinish = async (values) => {
    const resp = await dispatch(addUser(values));
    if (resp.payload.message === "success") {
      setLoader(false);
      window.location.href = "/dashboardglobal";
    } else {
      setLoader(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoader(false);
    toast.error("Erreur de connexion Veuillez réessayer");
  };

  return (
    <>
      <Row className="card-row">
        <Col span={24}>
          <Card bordered={false} className={styles.card}>
            <Title level={3} className="m-3 text-center">
              BIENVENUE !
            </Title>
            <div className={styles.logoContainer}>
              <img
                src={logo}
                alt="logo"
                style={{
                  width: "90%",
                  height: "70%",
                  objectFit: "cover",
                }}
              />
            </div>
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                className="mb-5"
                label="Utilisateur"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nom d’utilisateur!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className="mb-5"
                label="Mot de passe"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre mot de passe!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className={styles.submitBtnContainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loader}
                  onClick={() => setLoader(true)}
                >
                  Envoyer
                </Button>
              </Form.Item>
              <Form.Item className={styles.loginTableContainer}>
                <Row>
                  <Col span={24}>
                    {/* <LoginTable /> */}
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Login;
