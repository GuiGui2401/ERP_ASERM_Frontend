import React, { Fragment, useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  Table, 
  Space, 
  Typography, 
  Breadcrumb, 
  Tag, 
  Tooltip, 
  Row, 
  Col,
  Statistic,
  Divider,
  Image,
  Modal,
  Dropdown,
  Menu,
  Alert,
  Empty,
  Tabs,
  Badge,
  Input,
  Skeleton,
  Popconfirm,
  Descriptions
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  AppstoreOutlined, 
  HomeOutlined, 
  EyeOutlined, 
  ExclamationCircleOutlined,
  BarcodeOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  DollarOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  RollbackOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/deleteProductCategoryAction";
import { loadSingleProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/detailProductCategoryAction";
import { toast } from "react-toastify";
import Loader from "../../loader/loader";
import PageTitle from "../../page-header/PageHeader";
import GenerateBarcodePopUp from "../product/generateBarcodePopUp";
import "./detailProductCategory.css";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

// Composant de tableau personnalisé pour afficher les produits
function CustomTable({ list, categoryName }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  // Définition des colonnes du tableau
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 80,
      render: (imageUrl) => (
        <div className="product-image-container">
          {imageUrl ? (
            <Image 
              width={40}
              height={40}
              src={imageUrl} 
              alt="product"
              className="product-thumbnail"
              fallback="data:image/png;base64,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"
              preview={false}
            />
          ) : (
            <div className="product-image-placeholder">
              <ShopOutlined />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
      width: 70,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      sortDirections: ["ascend", "descend"],
      responsive: ["md"],
      width: 120,
    },
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Link to={`/product/${record.id}`} className="product-name-link">
          {name}
        </Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ["ascend", "descend"],
      width: 100,
      align: "center",
      render: (quantity) => {
        const status = quantity <= 10 ? "error" : quantity <= 20 ? "warning" : "success";
        return <Badge count={quantity} showZero overflowCount={999} status={status} />;
      },
    },
    {
      title: "Prix",
      key: "prices",
      align: "right",
      width: 180,
      responsive: ["md"],
      render: (_, record) => (
        <Space direction="vertical" size={0} className="price-container">
          <Text type="secondary">Achat: {(record.purchase_price || 0).toLocaleString()} FCFA</Text>
          <Text strong>Vente: {(record.sale_price || 0).toLocaleString()} FCFA</Text>
        </Space>
      ),
    },
    {
      title: "Format",
      key: "unit_measurement_and_type",
      width: 120,
      responsive: ["lg"],
      render: (_, record) => (
        <Tag color="blue">
          {record.unit_measurement || "-"} {record.unit_type || "-"}
        </Tag>
      ),
      sorter: (a, b) => {
        const measurementA = a.unit_measurement || "";
        const measurementB = b.unit_measurement || "";
        const typeA = a.unit_type || "";
        const typeB = b.unit_type || "";
        
        const measurementComparison = measurementA.localeCompare(measurementB);
        if (measurementComparison !== 0) {
          return measurementComparison;
        }
        return typeA.localeCompare(typeB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Qté Commandée",
      dataIndex: "reorder_quantity",
      key: "reorder_quantity",
      width: 100,
      align: "center",
      responsive: ["lg"],
      render: (quantity) => quantity || 0,
      sorter: (a, b) => (a.reorder_quantity || 0) - (b.reorder_quantity || 0),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Voir le produit">
            <Link to={`/product/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} className="action-button" />
            </Link>
          </Tooltip>
          
          <Tooltip title="Générer code-barre">
            <Button 
              type="text" 
              icon={<BarcodeOutlined />} 
              onClick={() => <GenerateBarcodePopUp sku={record.sku ? record.sku : 0} />}
              className="action-button"
            />
          </Tooltip>
          
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />}>
                  <Link to={`/product/${record.id}/update`}>
                    Modifier
                  </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                  Supprimer
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="text" icon={<InfoCircleOutlined />} className="action-button" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Initialiser les colonnes à afficher
  useEffect(() => {
    setColumnItems(menuItems);
    setColumnsToShow(columns);
    setFilteredList(list);
  }, [list]);

  // Mettre à jour les menuItems quand columns change
  const menuItems = columns.map((item) => ({
    key: item.key,
    label: (
      <Space>
        <span>{item.title}</span>
        {columnsToShow.some(col => col.key === item.key) && (
          <Tag color="green">Visible</Tag>
        )}
      </Space>
    ),
  }));

  // Gérer la visibilité des colonnes
  const colVisibilityClickHandler = (col) => {
    const ifColFound = columnsToShow.find((item) => item.key === col.key);
    if (ifColFound) {
      const filteredColumnsToShow = columnsToShow.filter(
        (item) => item.key !== col.key
      );
      setColumnsToShow(filteredColumnsToShow);
    } else {
      const foundIndex = columns.findIndex((item) => item.key === col.key);
      const foundCol = columns.find((item) => item.key === col.key);
      let updatedColumnsToShow = [...columnsToShow];
      updatedColumnsToShow.splice(foundIndex, 0, foundCol);
      setColumnsToShow(updatedColumnsToShow);
    }
  };

  // Ajouter des clés aux items de la liste
  const addKeys = (arr) => arr?.map((i) => ({ ...i, key: i.id })) || [];

  // Gérer la recherche
  const handleSearch = (value) => {
    setSearchText(value);
    if (list) {
      const filtered = list.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(filtered);
    }
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Rechercher un produit..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="search-input"
            />
          </Col>
          
          <Col xs={24} md={12} className="table-actions">
            <Space wrap>
              <Tooltip title="Ajouter un produit à cette catégorie">
                <Link to="/product?tab=add">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                  >
                    Ajouter un produit
                  </Button>
                </Link>
              </Tooltip>
              
              {list && (
                <Tooltip title="Exporter en CSV">
                  <CSVLink
                    data={list}
                    filename={`catégorie_${categoryName || "produits"}_${new Date().toISOString().split('T')[0]}`}
                    className="csv-link"
                  >
                    <Button icon={<DownloadOutlined />}>
                      Exporter CSV
                    </Button>
                  </CSVLink>
                </Tooltip>
              )}
              
              <Dropdown
                overlay={
                  <Menu onClick={colVisibilityClickHandler} items={menuItems} />
                }
                placement="bottomRight"
              >
                <Button>Colonnes</Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </div>
      
      <Table
        columns={columnsToShow}
        dataSource={addKeys(filteredList)}
        scroll={{ x: 1000 }}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} produits`,
        }}
        className="products-table"
        rowClassName={(record, index) => index % 2 === 0 ? "even-row" : "odd-row"}
        locale={{
          emptyText: <Empty description="Aucun produit dans cette catégorie" />,
        }}
        size="middle"
      />
    </div>
  );
}

// Composant principal de détail de catégorie
const DetailProductCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // États locaux
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Obtenir la catégorie du store Redux
  const category = useSelector((state) => state.productCategories.category);

  // Charger les données de la catégorie
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        await dispatch(loadSingleProductCategory(id));
      } catch (error) {
        console.error("Erreur lors du chargement de la catégorie:", error);
        toast.error("Erreur lors du chargement des détails de la catégorie");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [dispatch, id]);

  // Supprimer la catégorie
  const handleDelete = () => {
    confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
      icon: <ExclamationCircleOutlined />,
      content: "Cette action est irréversible. Tous les produits associés seront désassociés de cette catégorie.",
      okText: "Oui, supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await dispatch(DeleteProductCategory(id));
          toast.warning(`La catégorie "${category.name}" ne peut pas être supprimée. Elle contient encore des produits.`);
          navigate("/product-category");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          toast.error("Erreur lors de la suppression de la catégorie");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  // Vérifier si l'utilisateur est connecté
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Calculer les statistiques de la catégorie
  const getCategoryStats = () => {
    if (!category || !category.product) return { count: 0, totalValue: 0, avgPrice: 0 };
    
    const count = category.product.length;
    let totalValue = 0;
    
    category.product.forEach(product => {
      totalValue += (product.sale_price || 0) * (product.quantity || 0);
    });
    
    const avgPrice = count > 0 ? totalValue / count : 0;
    
    return { count, totalValue, avgPrice };
  };
  
  const stats = getCategoryStats();

  // Afficher le chargement
  if (loading) {
    return (
      <div className="category-detail-container">
        <PageTitle title="Retour" subtitle="DÉTAILS DE LA CATÉGORIE" />
        <div className="loading-container">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  // Si la catégorie n'existe pas
  if (!category) {
    return (
      <div className="category-detail-container">
        <PageTitle title="Retour" subtitle="DÉTAILS DE LA CATÉGORIE" />
        <Alert
          message="Catégorie non trouvée"
          description="La catégorie que vous recherchez n'existe pas ou a été supprimée."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/product-category")}>
              Retour à la liste des catégories
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="category-detail-container">
      <PageTitle title="Retour" subtitle={`CATÉGORIE: ${category?.name}`} />
      
      {/* Fil d'Ariane */}
      <Breadcrumb className="category-breadcrumb">
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
          <span>{category.name}</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <div className="category-content">
        {/* En-tête avec actions */}
        <Card className="header-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={8}>
                <div className="category-title">
                  <Space align="center">
                    <AppstoreOutlined className="category-icon" />
                    <Title level={3}>{category.name}</Title>
                    <Tag color="blue">ID: {category.id}</Tag>
                  </Space>
                </div>
                <Space className="category-meta">
                  <Tag icon={<DatabaseOutlined />} color="default">
                    {stats.count} produits
                  </Tag>
                  <Text type="secondary">
                    Créée le {new Date(category.createdAt).toLocaleDateString()}
                  </Text>
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="category-actions">
                <Space wrap>
                  <Link to={`/product-category/${category.id}/update`} state={{ data: category }}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                    >
                      Renommer
                    </Button>
                  </Link>
                  
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteLoading}
                    onClick={handleDelete}
                  >
                    Supprimer
                  </Button>
                  
                  <Button
                    icon={<RollbackOutlined />}
                    onClick={() => navigate("/product-category")}
                  >
                    Retour
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* Statistiques */}
        <Card className="stats-card">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Nombre de produits"
                value={stats.count}
                prefix={<DatabaseOutlined />}
                className="category-statistic"
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Valeur totale du stock"
                value={stats.totalValue}
                precision={0}
                suffix="FCFA"
                prefix={<DollarOutlined />}
                className="category-statistic"
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Prix moyen"
                value={stats.avgPrice}
                precision={0}
                suffix="FCFA"
                prefix={<LineChartOutlined />}
                className="category-statistic"
              />
            </Col>
          </Row>
        </Card>
        
        {/* Contenu principal avec onglets */}
        <Card className="content-card">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            className="category-tabs"
          >
            <TabPane 
              tab={
                <span>
                  <DatabaseOutlined /> 
                  Produits
                  <Badge 
                    count={stats.count} 
                    showZero 
                    size="small" 
                    offset={[5, -3]}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </span>
              } 
              key="1"
            >
              {category?.product && category.product.length > 0 ? (
                <CustomTable
                  list={category.product}
                  categoryName={category.name}
                />
              ) : (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      Cette catégorie ne contient aucun produit.
                      <br />
                      <Link to="/product?tab=add">
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
                          Ajouter un produit
                        </Button>
                      </Link>
                    </span>
                  }
                />
              )}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <InfoCircleOutlined /> 
                  Informations
                </span>
              } 
              key="2"
            >
              <div className="category-info">
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Card title="Détails de la catégorie" className="info-detail-card">
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
                        <Descriptions.Item label="Nom">{category.name}</Descriptions.Item>
                        <Descriptions.Item label="Date de création">
                          {new Date(category.createdAt).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                          {category.description || "Aucune description"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Card title="Utilisation de la catégorie" className="info-usage-card">
                      <Alert
                        message="Informations sur la gestion des catégories"
                        description={
                          <ul className="category-tips">
                            <li>Les catégories permettent d'organiser vos produits pour une meilleure gestion</li>
                            <li>Une catégorie ne peut être supprimée si elle contient des produits</li>
                            <li>Vous pouvez renommer une catégorie à tout moment</li>
                            <li>L'ajout de produits à une catégorie se fait depuis la page d'ajout ou de modification de produit</li>
                          </ul>
                        }
                        type="info"
                        showIcon
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default DetailProductCategory;