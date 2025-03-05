import React, { useState } from "react";
import { 
  Button, 
  Card, 
  Col, 
  Form, 
  Input, 
  Row, 
  Typography, 
  Space, 
  Alert, 
  Upload, 
  Divider,
  Tooltip
} from "antd";
import { 
  PlusOutlined, 
  AppstoreOutlined, 
  UploadOutlined, 
  SaveOutlined,
  InfoCircleOutlined,
  CloudUploadOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/addProductCategoryAciton";
import UploadMany from "../Card/UploadMany";
import "./AddProdCat.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AddProductCategory = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  // États locaux
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Gérer le clic sur le bouton
  const onClick = () => {
    setLoading(true);
  };

  // Gérer la soumission du formulaire
  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      const resp = await dispatch(addProductCategory(values));
      if (resp.message === "success") {
        setSuccess(true);
        form.resetFields();
        setTimeout(() => setSuccess(false), 5000); // Masquer le message après 5 secondes
      } else {
        setError("Une erreur est survenue lors de l'ajout de la catégorie");
      }
    } catch (error) {
      console.log(error.message);
      setError("Une erreur est survenue lors de l'ajout de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  // Gérer les erreurs de validation
  const onFinishFailed = (errorInfo) => {
    setLoading(false);
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="add-category-container">
      <Row gutter={[24, 24]} className="category-row">
        {/* Formulaire d'ajout de catégorie */}
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card 
            className="category-form-card"
            title={
              <Space>
                <AppstoreOutlined className="card-icon" />
                <span>Ajouter une nouvelle catégorie</span>
              </Space>
            }
            bordered={false}
          >
            {success && (
              <Alert
                message="Catégorie ajoutée avec succès"
                description="La nouvelle catégorie a été créée et est maintenant disponible pour vos produits."
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
              name="add_category"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="category-form"
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
                tooltip="Nom distinctif pour la catégorie de produits"
              >
                <Input 
                  placeholder="Ex: Médicaments, Cosmétiques, etc." 
                  prefix={<AppstoreOutlined className="site-form-item-icon" />}
                  suffix={
                    <Tooltip title="Le nom doit être unique et descriptif">
                      <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                  }
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={onClick}
                  icon={<SaveOutlined />}
                  className="submit-button"
                >
                  Ajouter la catégorie
                </Button>
              </Form.Item>
            </Form>
            
            <Divider dashed className="form-divider">
              <Text type="secondary">OU</Text>
            </Divider>
            
            <div className="quick-add-section">
              <Title level={5}>Ajouter rapidement</Title>
              <Space className="quick-add-buttons">
                <Button type="default" icon={<AppstoreOutlined />}>Médicaments</Button>
                <Button type="default" icon={<AppstoreOutlined />}>Cosmétiques</Button>
                <Button type="default" icon={<AppstoreOutlined />}>Équipements</Button>
              </Space>
            </div>
          </Card>
        </Col>
        
        {/* Section importation CSV */}
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card 
            className="import-card"
            title={
              <Space>
                <CloudUploadOutlined className="card-icon" />
                <span>Importer des catégories</span>
              </Space>
            }
            bordered={false}
          >
            <div className="import-content">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                  message="Importation en masse"
                  description="Importez plusieurs catégories à la fois à partir d'un fichier CSV. Cela vous permet de gagner du temps lors de la configuration initiale."
                  type="info"
                  showIcon
                />
                
                <div className="csv-template">
                  <Title level={5}>Format du fichier CSV</Title>
                  <Text>Le fichier CSV doit contenir les colonnes suivantes:</Text>
                  <ul className="csv-columns">
                    <li><Text code>name</Text> - Nom de la catégorie (obligatoire)</li>
                    <li><Text code>description</Text> - Description de la catégorie (optionnel)</li>
                  </ul>
                  <div className="template-download">
                    <Button type="link" icon={<UploadOutlined />}>
                      Télécharger un modèle CSV
                    </Button>
                  </div>
                </div>
                
                <div className="upload-section">
                  <UploadMany urlPath={"category"} />
                </div>
                
                <Paragraph type="secondary" className="import-note">
                  <InfoCircleOutlined /> Note: Assurez-vous que les catégories dans votre fichier CSV ne sont pas déjà existantes dans le système pour éviter les doublons.
                </Paragraph>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddProductCategory;