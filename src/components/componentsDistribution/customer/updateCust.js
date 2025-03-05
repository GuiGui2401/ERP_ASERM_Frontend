import { 
  Alert, 
  Button, 
  Col, 
  Form, 
  Input, 
  Row, 
  Typography, 
  Select, 
  Card,
  Divider,
  Spin,
  message 
} from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";
import PageTitle from "../../page-header/PageHeader";

//Update customer API REQ
const updateCustomer = async (id, values) => {
  try {
    const response = await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `customer/${id}`,
      data: {
        ...values,
      },
    });
    return "success";
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

function UpdateCust() {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  //Loading Old data from URL
  const location = useLocation();
  const { data } = location.state;
  const TypeCustomer = ["Distributeur", "Pharmacie"];

  const cust = data;
  const [initValues, setInitValues] = useState({
    name: cust.name,
    phone: cust.phone,
    nameresponsable: cust.nameresponsable,
    quartier: cust.quartier,
    ville: cust.ville,
    due_amount: cust.due_amount,
    email: cust.email || "",
    website: cust.website || "",
    rue: cust.rue || "",
    type_customer: cust.type_customer || "Distributeur"
  });

  useEffect(() => {
    form.setFieldsValue(initValues);
  }, [form, initValues]);

  const onFinish = (values) => {
    setLoading(true);
    try {
      updateCustomer(id, values)
        .then(() => {
          setSuccess(true);
          toast.success("Client mis à jour avec succès");
          setTimeout(() => {
            navigate(`/customer/${id}`);
          }, 2000);
        })
        .catch((error) => {
          toast.error("Erreur lors de la mise à jour: " + error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  
  return (
    <>
      <PageTitle
        title={`Retour`}
        subtitle={`Modification du client ${cust.name} (ID: ${id})`}
      />
      <div className="container">
        <Row justify="center" className="my-4">
          <Col
            xs={24}
            sm={24}
            md={20}
            lg={18}
            xl={16}
          >
            <Card 
              className="shadow-sm" 
              bordered={false}
              title={
                <Title level={4} className="text-center mb-0">
                  Modification des informations client
                </Title>
              }
            >
              {success && (
                <Alert
                  message="Les données du client ont été mises à jour avec succès"
                  description="Vous allez être redirigé vers la page de détails du client."
                  type="success"
                  closable
                  showIcon
                  className="mb-4"
                />
              )}
              
              <Spin spinning={loading}>
                <Form
                  form={form}
                  layout="vertical"
                  name="update_customer"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  initialValues={initValues}
                >
                  <Divider orientation="left">Informations de l'entreprise</Divider>
                  
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="Nom de l'entreprise"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le nom de l'entreprise!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Nom du responsable"
                        name="nameresponsable"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le nom du responsable!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Téléphone"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le numéro de téléphone!",
                          },
                          {
                            pattern: /^[0-9]{8,14}$/,
                            message: "Format de numéro invalide"
                          }
                        ]}
                      >
                        <Input maxLength={14} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: "Veuillez saisir un email valide!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Site web"
                        name="website"
                        rules={[
                          {
                            type: "url",
                            message: "Veuillez entrer une URL valide!",
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">Adresse</Divider>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Rue"
                        name="rue"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la rue!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Quartier"
                        name="quartier"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le quartier!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="Ville"
                        name="ville"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la ville!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="type_customer"
                        label="Type de Client"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner le type de client!",
                          },
                        ]}
                      >
                        <Select placeholder="Sélectionnez le type de client">
                          {TypeCustomer.map((custom) => (
                            <Select.Option key={custom} value={custom}>
                              {custom}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Montant à payer"
                        name="due_amount"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le montant!",
                          },
                        ]}
                      >
                        <Input type="number" min={0} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item className="text-center mt-4">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      icon={<EditOutlined />}
                    >
                      Mettre à jour
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UpdateCust;