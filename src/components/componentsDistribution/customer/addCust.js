import {
  Button,
  Card,
  Col,
  Select,
  Form,
  Input,
  Row,
  Typography,
  Divider,
} from "antd";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { addCustomer } from "../../../redux/reduxDistribution/actions/customer/addCustomerAciton";
import UploadMany from "../Card/UploadMany";
import styles from "./AddCust.module.css";

const AddCust = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const TypeCustomer = ["Grossiste", "Pharmacie"];
  const [loading, setLoading] = useState(false);
  
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const resp = await dispatch(addCustomer(values));
      if (resp.message === "success") {
        form.resetFields();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoading(false);
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <Row className="mr-top" justify="space-between" gutter={[24, 24]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          className="rounded column-design"
        >
          <Card 
            bordered={false} 
            className="shadow-sm"
            title={
              <Title level={4} className="text-center mb-0">
                Ajouter une entreprise cliente
              </Title>
            }
          >
            <Form
              form={form}
              name="add_customer"
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
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
                    <Input placeholder="Entrez le nom de l'entreprise" />
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
                    <Input placeholder="Entrez le nom du responsable" />
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
                    <Input placeholder="Ex: 00225XXXXXXXX" maxLength={14} />
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
                        required: true,
                        type: "email",
                        message: "Veuillez saisir un email valide!",
                      },
                    ]}
                  >
                    <Input placeholder="exemple@domaine.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Site web"
                    name="website"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez saisir le site web!",
                      },
                      {
                        type: "url",
                        message: "Veuillez entrer une URL valide!",
                      }
                    ]}
                  >
                    <Input placeholder="https://exemple.com" />
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
                    <Input placeholder="Rue / Avenue" />
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
                    <Input placeholder="Quartier" />
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
                    <Input placeholder="Ville" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
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
                    <Select
                      placeholder="Sélectionnez le type de client"
                      optionFilterProp="children"
                    >
                      {TypeCustomer.map((custom) => (
                        <Select.Option key={custom} value={custom}>
                          {custom}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="text-center mt-4">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  size="large"
                >
                  Ajouter un compte client
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          className="column-design rounded"
        >
          <Card 
            bordered={false} 
            className={`${styles.importCsvCard} shadow-sm h-100`}
            title={
              <Title level={4} className="text-center mb-0">
                Importer à partir d'un fichier CSV
              </Title>
            }
          >
            <div className="text-center my-5">
              <UploadMany urlPath={"customer"} />
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddCust;