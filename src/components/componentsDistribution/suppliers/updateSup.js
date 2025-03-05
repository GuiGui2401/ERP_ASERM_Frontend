import { 
  Alert, 
  Button, 
  Card, 
  Col, 
  Form, 
  Input, 
  Row, 
  Typography, 
  Space, 
  Breadcrumb, 
  Divider,
  InputNumber
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  SaveOutlined,
  PhoneOutlined,
  GlobalOutlined,
  DollarOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { Navigate, useLocation, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../page-header/PageHeader";

// API pour la mise à jour du fournisseur
const updateSupplier = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `supplier/${id}`,
      data: {
        ...values,
      },
    });
    return "success";
  } catch (error) {
    console.log(error.message);
    throw new Error("Échec de la mise à jour");
  }
};

function UpdateSup() {
  const { Title, Text } = Typography;
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Chargement des données du fournisseur à partir de l'URL
  const location = useLocation();
  const { data } = location.state;

  const sup = data;
  const [initValues, setInitValues] = useState({
    name: sup.name,
    phone: sup.phone,
    address: sup.address,
    due_amount: sup.due_amount,
  });

  // Effet pour réinitialiser le formulaire lorsque les valeurs initiales changent
  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [form, initValues]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateSupplier(id, values);
      setSuccess(true);
      toast.success("Les informations du fournisseur ont été mises à jour");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Erreur lors de la mise à jour du fournisseur");
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoading(false);
    console.log("Failed:", errorInfo);
    toast.error("Erreur dans le formulaire");
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <Fragment>
      <PageTitle title="Retour" subtitle={`Modifier le fournisseur - ${sup.name}`} />
      
      <div className="breadcrumb-container" style={{ marginBottom: 16 }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined /> Accueil
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/supplier">
              <UserOutlined /> Fournisseurs
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/supplier/${id}`}>
              {sup.name}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Modifier</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={18} lg={12} xl={10}>
          <Card 
            bordered={false} 
            className="card-shadow"
            title={
              <Space align="center">
                <GlobalOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <Title level={4} style={{ marginBottom: 0 }}>Modifier le fournisseur</Title>
              </Space>
            }
            extra={
              <Link to={`/supplier/${id}`}>
                <Button icon={<ArrowLeftOutlined />}>Retour</Button>
              </Link>
            }
          >
            <Divider style={{ marginTop: 0 }} />
            
            {success && (
              <Alert
                message="Mise à jour réussie"
                description="Les informations du fournisseur ont été mises à jour avec succès."
                type="success"
                showIcon
                closable
                style={{ marginBottom: 24 }}
              />
            )}
            
            <Form
              form={form}
              layout="vertical"
              initialValues={initValues}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <Space>
                    <GlobalOutlined />
                    <span>Nom du fournisseur</span>
                  </Space>
                }
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom du fournisseur!",
                  },
                ]}
              >
                <Input placeholder="Entrez le nom de l'entreprise" />
              </Form.Item>
              
              <Form.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    <span>Numéro de téléphone</span>
                  </Space>
                }
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le numéro de téléphone!",
                  },
                ]}
              >
                <Input maxLength={14} placeholder="+33 XXXXXXXXX" />
              </Form.Item>
              
              <Form.Item
                label={
                  <Space>
                    <HomeOutlined />
                    <span>Adresse</span>
                  </Space>
                }
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir l'adresse!",
                  },
                ]}
              >
                <Input.TextArea rows={3} placeholder="Entrez l'adresse complète" />
              </Form.Item>
              
              <Form.Item
                label={
                  <Space>
                    <DollarOutlined />
                    <span>Montant à payer</span>
                  </Space>
                }
                name="due_amount"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le montant à payer!",
                  },
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0} 
                  step={0.01}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  parser={value => value.replace(/\s+/g, '')}
                  addonAfter="€"
                />
              </Form.Item>

              <Divider />
              
              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button 
                    onClick={() => form.resetFields()} 
                    disabled={loading}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    Enregistrer les modifications
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default UpdateSup;