import React from "react";
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
  Divider,
  Breadcrumb,
  InputNumber,
  Tooltip,
  Tag,
  Result,
  Select
} from "antd";
import {
  SaveOutlined,
  RollbackOutlined,
  ShopOutlined,
  HomeOutlined,
  DollarOutlined,
  EditOutlined,
  InfoCircleOutlined,
  TagOutlined,
  BarcodeOutlined,
  NumberOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../page-header/PageHeader";
import "./updateProd.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Update Product API REQ
const updateProduct = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `product/${id}`,
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

function UpdateProd() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  // Loading Old data from URL
  const location = useLocation();
  const { data } = location.state || {};
  
  // États locaux
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const prod = data;
  // Si les données ne sont pas disponibles, rediriger vers la liste
  if (!data) {
    console.log("données non disponibles");
  }
  // États pour les calculs de prix
  const [purchasePrice, setPurchasePrice] = useState(prod.purchase_price || 0);
  const [depense, setDepense] = useState(prod.depense || 0);
  const [marge, setMarge] = useState(prod.marge || 0);
  const [salePrice, setSalePrice] = useState(prod.sale_price || 0);
  
  // Calculer le prix de vente lorsque les composantes changent
  useEffect(() => {
    const newSalePrice = parseFloat(purchasePrice || 0) + parseFloat(depense || 0) + parseFloat(marge || 0);
    setSalePrice(newSalePrice);
    form.setFieldsValue({ sale_price: newSalePrice });
  }, [purchasePrice, depense, marge, form]);

  // Gérer la soumission du formulaire
  const onFinish = async (values) => {
    setSubmitting(true);
    setError(null);
    
    try {
      values.sale_price = salePrice;
      await updateProduct(id, values);
      setSuccess(true);
      toast.success("Les détails du produit ont été mis à jour avec succès");
      
      // Scroll vers le haut pour voir l'alerte de succès
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error.message);
      setError("Une erreur s'est produite lors de la mise à jour du produit. Veuillez réessayer.");
      toast.error("Erreur lors de la mise à jour du produit");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Veuillez corriger les erreurs dans le formulaire");
  };

  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Si la mise à jour est réussie et que nous voulons afficher un écran de succès
  if (success && false) { // Désactivé pour l'instant
    return (
      <>
        <PageTitle title="Retour" />
        <Result
          status="success"
          title="Produit mis à jour avec succès !"
          subTitle={`Le produit ${prod.name} a été mis à jour dans le système.`}
          extra={[
            <Button type="primary" key="back" onClick={() => navigate("/products")}>
              Retour à la liste
            </Button>,
            <Button key="view" onClick={() => navigate(`/product/${id}`)}>
              Voir le produit
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <div className="update-product-container">
      <PageTitle title="Retour" />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="breadcrumb-container">
        <Breadcrumb.Item>
          <Link to="/dashboard"><HomeOutlined /> Accueil</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products"><ShopOutlined /> Produits</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/product/${id}`}><InfoCircleOutlined /> {prod.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined /> Modifier
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <Row className="content-container" gutter={[24, 24]}>
        {/* Formulaire de mise à jour */}
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card 
            className="update-form-card"
            title={
              <Space>
                <EditOutlined className="card-icon" />
                <Title level={4} className="card-title">Modifier le produit</Title>
              </Space>
            }
            extra={
              <Space>
                <Button
                  icon={<RollbackOutlined />}
                  onClick={() => navigate(`/product/${id}`)}
                >
                  Retour aux détails
                </Button>
              </Space>
            }
          >
            {success && (
              <Alert
                message="Succès"
                description="Les détails du produit ont été mis à jour avec succès"
                type="success"
                showIcon
                closable
                className="success-alert"
              />
            )}
            
            {error && (
              <Alert
                message="Erreur"
                description={error}
                type="error"
                showIcon
                closable
                className="error-alert"
              />
            )}
            
            <Form
              form={form}
              initialValues={{...prod}}
              name="update_product"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="update-form"
            >
              {/* Section Informations de base */}
              <div className="form-section">
                <Title level={5} className="section-title">
                  <InfoCircleOutlined /> Informations de base
                </Title>
                <Divider className="section-divider" />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Nom du produit"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le nom du produit",
                        },
                      ]}
                    >
                      <Input 
                        prefix={<TagOutlined className="form-icon" />} 
                        placeholder="Nom du produit"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Marque"
                      name="marque"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir la marque du produit",
                        },
                      ]}
                    >
                      <Input 
                        prefix={<TagOutlined className="form-icon" />} 
                        placeholder="Marque du produit"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <Space>
                          <span>Collisage</span>
                          <Tooltip title="Nombre d'unités par colis">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                      name="collisage"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le collisage",
                        },
                      ]}
                    >
                      <InputNumber 
                        min={0}
                        placeholder="Collisage"
                        style={{ width: '100%' }}
                        prefix={<NumberOutlined className="form-icon" />}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item
                      label={
                        <Space>
                          <span>Unité</span>
                          <Tooltip title="Unité de mesure du produit">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                      name="unit_measurement"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir l'unité de mesure",
                        },
                      ]}
                    >
                      <InputNumber 
                        min={0}
                        placeholder="Unité de mesure"
                        style={{ width: '100%' }}
                        prefix={<NumberOutlined className="form-icon" />}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Quantité"
                      name="quantity"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir la quantité",
                        },
                      ]}
                    >
                      <InputNumber 
                        min={0}
                        placeholder="Quantité"
                        style={{ width: '100%' }}
                        prefix={<NumberOutlined className="form-icon" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Catégorie"
                      name="unit_type"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez sélectionner une catégorie",
                        },
                      ]}
                    >
                      <Select placeholder="Sélectionner une catégorie">
                        <Option value="médicament">Médicament</Option>
                        <Option value="matériel">Matériel médical</Option>
                        <Option value="cosmétique">Cosmétique</Option>
                        <Option value="autre">Autre</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Gencode EAN"
                      name="gencode"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le Gencode EAN",
                        },
                      ]}
                    >
                      <Input 
                        prefix={<BarcodeOutlined className="form-icon" />}
                        placeholder="Code-barres EAN du produit"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              
              {/* Section Prix et tarification */}
              <div className="form-section">
                <Title level={5} className="section-title">
                  <DollarOutlined /> Prix et tarification
                </Title>
                <Divider className="section-divider" />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Prix d'achat"
                      name="purchase_price"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le prix d'achat",
                        },
                      ]}
                    >
                      <InputNumber 
                        min={0}
                        step="0.5"
                        precision={2}
                        style={{ width: '100%' }}
                        prefix={<DollarOutlined className="form-icon" />}
                        placeholder="Prix d'achat"
                        value={purchasePrice}
                        onChange={(value) => setPurchasePrice(value)}
                        addonAfter="FCFA"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Dépenses"
                      name="depense"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir les dépenses",
                        },
                      ]}
                      tooltip="Coûts additionnels liés au produit (transport, taxes, etc.)"
                    >
                      <InputNumber 
                        min={0}
                        step="0.5"
                        precision={2}
                        style={{ width: '100%' }}
                        prefix={<DollarOutlined className="form-icon" />}
                        placeholder="Dépenses"
                        value={depense}
                        onChange={(value) => setDepense(value)}
                        addonAfter="FCFA"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Marge"
                      name="marge"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir la marge",
                        },
                      ]}
                      tooltip="Bénéfice sur la vente du produit"
                    >
                      <InputNumber 
                        min={0}
                        step="0.5"
                        precision={2}
                        style={{ width: '100%' }}
                        prefix={<DollarOutlined className="form-icon" />}
                        placeholder="Marge"
                        value={marge}
                        onChange={(value) => setMarge(value)}
                        addonAfter="FCFA"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  label={
                    <Space>
                      <span>Prix de vente</span>
                      <Tag color="processing">Calculé automatiquement</Tag>
                    </Space>
                  }
                  name="sale_price"
                >
                  <InputNumber 
                    readOnly
                    value={salePrice}
                    style={{ width: '100%' }}
                    prefix={<DollarOutlined className="form-icon" />}
                    addonAfter="FCFA"
                    className="calculated-field"
                  />
                </Form.Item>
                
                <Paragraph type="secondary" className="calculation-info">
                  <InfoCircleOutlined /> Le prix de vente est calculé automatiquement comme la somme du prix d'achat, des dépenses et de la marge.
                </Paragraph>
              </div>
              
              <div className="form-actions">
                <Space size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={submitting}
                    size="large"
                  >
                    Mettre à jour le produit
                  </Button>
                  
                  <Button
                    danger
                    icon={<RollbackOutlined />}
                    onClick={() => navigate("/products")}
                    size="large"
                  >
                    Annuler
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>
        
        {/* Carte d'information */}
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card 
            className="info-card"
            title={
              <Space>
                <InfoCircleOutlined className="card-icon" />
                <Title level={4} className="card-title">Informations</Title>
              </Space>
            }
          >
            <div className="product-summary">
              <div className="summary-item">
                <Text strong>ID du produit:</Text>
                <Text>{id}</Text>
              </div>
              
              <div className="summary-item">
                <Text strong>Nom actuel:</Text>
                <Text>{prod.name}</Text>
              </div>
              
              <div className="summary-item">
                <Text strong>Marque:</Text>
                <Text>{prod.marque || "Non définie"}</Text>
              </div>
              
              <div className="summary-item">
                <Text strong>Prix d'achat actuel:</Text>
                <Text>{parseFloat(prod.purchase_price || 0).toFixed(2)} FCFA</Text>
              </div>
              
              <div className="summary-item">
                <Text strong>Prix de vente actuel:</Text>
                <Text>{parseFloat(prod.sale_price || 0).toFixed(2)} FCFA</Text>
              </div>
            </div>
            
            <Divider />
            
            <Alert
              message="Conseils pour la mise à jour"
              description={
                <ul className="tips-list">
                  <li>Assurez-vous que le nom du produit est clair et descriptif</li>
                  <li>Vérifiez que le code EAN est correct et unique</li>
                  <li>Ajustez la marge en fonction de votre stratégie de prix</li>
                  <li>Mettez à jour la quantité si vous avez reçu un nouveau stock</li>
                </ul>
              }
              type="info"
              showIcon
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UpdateProd;