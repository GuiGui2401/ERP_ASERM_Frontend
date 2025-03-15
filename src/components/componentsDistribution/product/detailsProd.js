import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  Popover,
  Row,
  Typography,
  Space,
  Divider,
  Descriptions,
  Tag,
  Breadcrumb,
  Tooltip,
  Skeleton,
  Statistic,
  Alert,
  Modal
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  HomeOutlined,
  TagOutlined,
  DollarOutlined,
  BarcodeOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct } from "../../../redux/reduxDistribution/actions/product/deleteProductAction";
import { loadSingleProduct } from "../../../redux/reduxDistribution/actions/product/detailProductAction";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";
import noImage from "../../../assets/images/No-Image.png";
import "./detailsProd.css";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const DetailsProd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // États locaux
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  
  // Sélecteur Redux
  const product = useSelector((state) => state.products.product);

  // Charger les détails du produit
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        await dispatch(loadSingleProduct(id));
      } catch (error) {
        console.error("Erreur lors du chargement des détails du produit:", error);
        toast.error("Erreur lors du chargement des détails du produit");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [dispatch, id]);

  // Supprimer le produit (avec confirmation)
  const showDeleteConfirm = () => {
    confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      icon: <ExclamationCircleOutlined />,
      content: `Cette action est irréversible. Le produit "${product?.name}" sera définitivement supprimé.`,
      okText: "Oui, supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await dispatch(deleteProduct(id));
          toast.warning(`Le produit "${product?.name}" a été supprimé`);
          navigate("/products");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          toast.error("Erreur lors de la suppression du produit");
        } finally {
          setDeleteLoading(false);
          setVisible(false);
        }
      },
    });
  };

  // Gérer l'affichage du popover
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Afficher le chargement
  if (loading) {
    return (
      <>
        <PageTitle title="Retour" subtitle="Détails du produit" />
        <div className="product-details-skeleton">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </>
    );
  }

  // Si le produit n'existe pas
  if (!product) {
    return (
      <>
        <PageTitle title="Retour" subtitle="Détails du produit" />
        <Alert
          message="Produit non trouvé"
          description="Le produit que vous recherchez n'existe pas ou a été supprimé."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/products")}>
              Retour à la liste des produits
            </Button>
          }
        />
      </>
    );
  }

  return (
    <div className="product-detail-container">
      <PageTitle title="Retour" subtitle={product.name} />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="product-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Accueil
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/products">
            <ShopOutlined /> Produits
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <InfoCircleOutlined /> {product.name}
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="product-detail-content">
        <Row gutter={[24, 24]}>
          {/* En-tête avec actions */}
          <Col span={24}>
            <Card className="action-card">
              <div className="card-header">
                <Space direction="vertical" size={4}>
                  <Title level={3}>{product.name}</Title>
                  <Space size="middle">
                    <Tag icon={<BarcodeOutlined />} color="processing">
                      Gencode EAN : {product.gencode || "N/A"}
                    </Tag>
                    <Tag icon={<TagOutlined />} color="default">
                      Code Produit : {product.sku || "N/A"}
                    </Tag>
                    <Tag icon={<DollarOutlined />} color="success">
                      Prix : {product.sale_price || 0} FCFA
                    </Tag>
                  </Space>
                </Space>
                
                <div className="action-buttons">
                  <Space>
                    <Link to={`/product/${product.id}/update`} state={{ data: product }}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                      >
                        Modifier
                      </Button>
                    </Link>
                    
                    <Button
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={showDeleteConfirm}
                      loading={deleteLoading}
                    >
                      Supprimer
                    </Button>
                    
                    <Button 
                      type="default" 
                      icon={<RollbackOutlined />}
                      onClick={() => navigate("/products")}
                    >
                      Retour
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
          
          {/* Informations détaillées du produit */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <InfoCircleOutlined className="card-icon" />
                  <span>Détails du produit</span>
                </Space>
              }
              className="details-card"
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                className="product-descriptions"
              >
                <Descriptions.Item label="Nom">{product.name}</Descriptions.Item>
                <Descriptions.Item label="Marque">{product.marque || "Non définie"}</Descriptions.Item>
                <Descriptions.Item label="Gencode EAN">{product.gencode || "Non défini"}</Descriptions.Item>
                <Descriptions.Item label="Code produit (SKU)">{product.sku || "Non défini"}</Descriptions.Item>
                <Descriptions.Item label="Marque">{product.product_category_id ? `ID: ${product.product_category_id}` : "Non catégorisé"}</Descriptions.Item>
                <Descriptions.Item label="Type">{product.unit_type || "Non défini"}</Descriptions.Item>
                <Descriptions.Item label="Fournisseur">{product.idSupplier ? `ID: ${product.idSupplier}` : "Non défini"}</Descriptions.Item>
                <Descriptions.Item label="Collisage">{product.collisage || "0"}</Descriptions.Item>
                <Descriptions.Item label="Unité de mesure">{product.unit_measurement || "Unité"}</Descriptions.Item>
                <Descriptions.Item label="Quantité en stock">{product.quantity || "0"}</Descriptions.Item>
              </Descriptions>
              
              <Divider>
                <Space>
                  <DollarOutlined />
                  <span>Informations sur les prix</span>
                </Space>
              </Divider>
              
              <Row gutter={[16, 16]} className="price-statistics">
                <Col xs={24} sm={12} md={6}>
                  <Statistic 
                    title="Prix d'achat" 
                    value={product.purchase_price || 0} 
                    suffix="FCFA"
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic 
                    title="Dépenses" 
                    value={product.depense || 0} 
                    suffix="FCFA"
                    precision={2}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic 
                    title="Marge" 
                    value={product.marge || 0} 
                    suffix="FCFA"
                    precision={2}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic 
                    title="Prix de vente" 
                    value={product.sale_price || 0} 
                    suffix="FCFA"
                    precision={2}
                    valueStyle={{ color: '#eb2f96', fontWeight: 'bold' }}
                  />
                </Col>
              </Row>

              <Divider />
              
              <div className="product-actions">
                <Space size="middle" wrap>
                  <Button icon={<ShoppingCartOutlined />} type="primary" ghost>
                    Ajouter au panier
                  </Button>
                  <Button icon={<BarcodeOutlined />}>
                    Imprimer code-barres
                  </Button>
                  <Button icon={<EditOutlined />}>
                    Ajuster le stock
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
          
          {/* Image du produit */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <ShopOutlined className="card-icon" />
                  <span>Image du produit</span>
                </Space>
              }
              className="image-card"
            >
              <div className="product-image-wrapper">
                <Image
                  className="product-image"
                  src={product.imageUrl || noImage}
                  alt={product.name}
                  fallback={noImage}
                />
              </div>
              
              <div className="product-image-info">
                <Alert
                  message="Information"
                  description="Vous pouvez mettre à jour l'image du produit en modifiant ses détails."
                  type="info"
                  showIcon
                />
              </div>
              
              <Divider />
              
              <div className="stock-info">
                <Title level={5}>Information de stock</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Quantité en stock"
                      value={product.quantity || 0}
                      suffix={product.unit_measurement || "unités"}
                      valueStyle={
                        product.quantity <= 10 
                          ? { color: '#f5222d' } 
                          : product.quantity <= 50 
                            ? { color: '#faad14' } 
                            : { color: '#52c41a' }
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Valeur du stock"
                      value={(product.quantity || 0) * (product.sale_price || 0)}
                      suffix="FCFA"
                      precision={2}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailsProd;