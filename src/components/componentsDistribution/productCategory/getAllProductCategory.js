import React, { useEffect, useState } from "react";
import UploadButton from "../../componentsRessourceHumaine/Buttons/UploadButton";
import { 
  Button, 
  Table, 
  Space, 
  Input, 
  Dropdown, 
  Menu, 
  Card, 
  Tag, 
  Typography, 
  Tooltip, 
  Row, 
  Col,
  Statistic,
  Empty,
  Avatar,
  Divider,
  Badge
} from "antd";
import { 
  AppstoreOutlined, 
  SearchOutlined, 
  DownloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  ExportOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/getProductCategoryAction";
import moment from "moment";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./productCategory.css";
import ProductCategoryTable from "../Table/ProductCategoryTable";

const { Title, Text } = Typography;
const { Search } = Input;


function CustomTable({ list, total }) {
  
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnsToShow, setColumnsToShow] = useState([]);

  // Charger les catégories au montage du composant
  useEffect(() => {
    setLoading(true);
    dispatch(loadAllProductCategory({ page: 1, limit: pageSize }))
      .finally(() => setLoading(false));
  }, [dispatch, pageSize]);

  // Recharger les données
  const handleReload = () => {
    setLoading(true);
    setSearchText("");
    dispatch(loadAllProductCategory({ page: 1, limit: pageSize }))
      .finally(() => setLoading(false));
  };

  // Mettre à jour les colonnes affichées
  const handleColumnVisibilityChange = (key) => {
    setColumnsToShow((prevColumns) =>
      prevColumns.includes(key)
        ? prevColumns.filter((col) => col !== key)
        : [...prevColumns, key]
    );
  };

  // Gérer le succès de l'upload
  const handleUploadSuccess = async () => {
    setLoading(true);
    await dispatch(loadAllProductCategory({ page: 1, limit: 10 }));
    setLoading(false);
  };

  return (
    <div className="category-table-container">
      <div className="table-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Rechercher une catégorie..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </Col>

          <Col xs={24} md={16} className="table-actions">
            <Space wrap>
              <Tooltip title="Actualiser">
                <Button icon={<ReloadOutlined />} onClick={handleReload} loading={loading}>
                  Actualiser
                </Button>
              </Tooltip>

              <Tooltip title="Ajouter une catégorie">
                <Link to="/product-category?tab=add">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Ajouter
                  </Button>
                </Link>
              </Tooltip>

              <UploadButton onUploadSuccess={handleUploadSuccess} />

              {list && (
                <Tooltip title="Exporter en CSV">
                  <CSVLink
                    data={list}
                    filename={`categories-${moment().format("YYYY-MM-DD")}`}
                    className="csv-link"
                  >
                    <Button icon={<SettingOutlined />}>Exporter</Button>
                  </CSVLink>
                </Tooltip>
              )}

              <Dropdown
                overlay={
                  <Menu>
                    {columnsToShow.map((col) => (
                      <Menu.Item key={col} onClick={() => handleColumnVisibilityChange(col)}>
                        {col}
                      </Menu.Item>
                    ))}
                    <Menu.Item key="add-column">Ajouter une colonne</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button icon={<SettingOutlined />}>Colonnes</Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Utilisation de notre nouvelle table...  */}
      <ProductCategoryTable
        data={list}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
      />
    </div>
  );
}


const GetAllProductCategory = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.productCategories?.list);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    productCount: 0
  });

  const handleUploadSuccess = async () => {
    setLoading(true);
    await dispatch(loadAllProductCategory({ page: 1, limit: 10 }));
    setLoading(false);
  };

  // Charger les Marques au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(loadAllProductCategory({ page: 1, limit: 10 }));
      } catch (error) {
        console.error("Erreur lors du chargement des Marques:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [dispatch]);

  // Calculer les statistiques (fictives pour la démo)
  useEffect(() => {
    if (list) {
      const total = list.length;
      // Ajouter nombre de produits fictif pour la démo
      let productCount = 0;
      let activeCount = 0;
      
      list.forEach(category => {
        const productsInCategory = Math.floor(Math.random() * 20);
        category.productsCount = productsInCategory;
        productCount += productsInCategory;
        
        if (productsInCategory > 0) {
          activeCount++;
        }
      });
      
      setCategoryStats({
        total,
        active: activeCount,
        inactive: total - activeCount,
        productCount
      });
    }
  }, [list]);

  return (
    <Card 
      className="category-list-card"
      title={
        <Space>
          <UnorderedListOutlined className="card-icon" />
          <Title level={5} className="card-title">Liste des Marques de produits</Title>
        </Space>
      }
      extra={
        <Space>
          <Link to="/product-category?tab=add">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
            >
              Ajouter une Marque
            </Button>
          </Link>
        </Space>
      }
    >
      <div className="category-stats">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total des Marques"
              value={categoryStats.total}
              loading={loading}
              prefix={<AppstoreOutlined />}
              className="total-stat"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Marques actives"
              value={categoryStats.active}
              loading={loading}
              prefix={<Badge status="success" />}
              className="active-stat"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Marques inactives"
              value={categoryStats.inactive}
              loading={loading}
              prefix={<Badge status="default" />}
              className="inactive-stat"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Produits classifiés"
              value={categoryStats.productCount}
              loading={loading}
              prefix={<InfoCircleOutlined />}
              className="products-stat"
            />
          </Col>
        </Row>
      </div>
      
      <Divider />
      
      <CustomTable list={list} total={list?.length || 0} />
    </Card>
  );
};

export default GetAllProductCategory;