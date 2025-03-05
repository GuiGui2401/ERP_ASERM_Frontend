import React, { useState, useEffect } from "react";
import { 
  Alert, 
  Button, 
  Col, 
  Form, 
  Input, 
  Row, 
  Typography, 
  Card, 
  Space, 
  Breadcrumb, 
  Divider, 
  Tooltip, 
  Skeleton
} from "antd";
import { 
  EditOutlined, 
  SaveOutlined, 
  RollbackOutlined, 
  HomeOutlined, 
  AppstoreOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import { Navigate, useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../page-header/PageHeader";
import "./updateProductCategory.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mettre à jour la catégorie de produit via l'API
const updateProductCategory = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `product-category/${id}`,
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

function UpdateProductCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // États locaux
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Récupérer les données de la catégorie depuis l'état de la navigation
  const { data } = location.state || {};
  
  // Extraire les données de la catégorie
  const category = data;
  
  // Valeurs initiales du formulaire
  const [initValues, setInitValues] = useState({
    name: category.name,
    description: category.description || "",
  });

  // Gérer la soumission du formulaire
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateProductCategory(id, values);
      setSuccess(true);
      toast.success("Les détails de la catégorie ont été mis à jour avec succès");
      setInitValues(values);
      
      // Faire défiler vers le haut pour voir l'alerte de succès
      window.scrollTo(0, 0);
      
      // Option : rediriger après un court délai
      // setTimeout(() => navigate(`/product-category/${id}`), 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Une erreur s'est produite lors de la mise à jour de la catégorie");
      toast.error("Erreur lors de la mise à jour de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  // Gérer les erreurs de validation
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Veuillez corriger les erreurs dans le formulaire");
  };

  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div className="update-category-container">
      <PageTitle title="Retour" subtitle={`MODIFIER LA CATÉGORIE: ${category.name}`} />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="update-category-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Accueil
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/product-category">
            <AppstoreOutlined /> Catégories
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/product-category/${id}`}>
            {category.name}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined /> Modifier
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <Row className="update-category-content" gutter={[24, 24]}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card 
            className="update-form-card"
            title={
              <Space>
                <EditOutlined className="card-icon" />
                <Title level={4} className="card-title">Modifier la catégorie</Title>
              </Space>
            }
            extra={
              <Button
                icon={<RollbackOutlined />}
                onClick={() => navigate(`/product-category/${id}`)}
              >
                Retour aux détails
              </Button>
            }
          >
            {success && (
              <Alert
                message="Succès"
                description="Les détails de la catégorie ont été mis à jour avec succès"
                type="success"
                showIcon
                closable
                className="success-alert"
                action={
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => navigate(`/product-category/${id}`)}
                  >
                    Voir les détails
                  </Button>
                }
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
              initialValues={initValues}
              name="update_category"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="update-form"
            >
              <Form.Item
                label="Nom de la catégorie"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom de la catégorie",
                  },
                ]}
                tooltip={{
                  title: "Le nom doit être unique et descriptif",
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input 
                  prefix={<AppstoreOutlined className="site-form-item-icon" />}
                  placeholder="Nom de la catégorie"
                />
              </Form.Item>
              
              <Form.Item
                label="Description (optionnelle)"
                name="description"
              >
                <TextArea
                  placeholder="Description détaillée de la catégorie..."
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
              
              <Form.Item className="form-actions">
                <Space size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    Mettre à jour
                  </Button>
                  
                  <Button
                    danger
                    icon={<RollbackOutlined />}
                    onClick={() => navigate(`/product-category/${id}`)}
                  >
                    Annuler
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
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
            <div className="category-info">
              <div className="info-item">
                <Text strong>ID de la catégorie:</Text>
                <Text>{id}</Text>
              </div>
              
              <div className="info-item">
                <Text strong>Nom actuel:</Text>
                <Text>{category.name}</Text>
              </div>
              
              <div className="info-item">
                <Text strong>Date de création:</Text>
                <Text>{new Date(category.createdAt).toLocaleString()}</Text>
              </div>
              
              <div className="info-item">
                <Text strong>Nombre de produits:</Text>
                <Text>{category.product?.length || 0} produits</Text>
              </div>
            </div>
            
            <Divider />
            
            <Alert
              message="Conseils pour la mise à jour"
              description={
                <ul className="update-tips">
                  <li>Choisissez un nom clair et descriptif pour faciliter l'identification</li>
                  <li>Les noms de catégorie doivent être uniques</li>
                  <li>Une description détaillée aide à comprendre la finalité de la catégorie</li>
                  <li>La mise à jour du nom n'affectera pas les produits déjà associés</li>
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

export default UpdateProductCategory;