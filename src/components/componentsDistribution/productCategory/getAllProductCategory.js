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
  const [columns, setColumns] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les colonnes à partir des données uploadées
  useEffect(() => {
    if (list.length > 0) {
      const dynamicColumns = Object.keys(list[0]).map((key) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key: key,
      }));
      setColumns(dynamicColumns);
      setColumnsToShow(dynamicColumns);
      setData(list);
    }
  }, [list]);

  // Ajouter une nouvelle ligne
  const handleAddRow = () => {
    const newRow = { key: Date.now(), name: "Nouvelle ligne" };
    setData([...data, newRow]);
  };

  // Ajouter une nouvelle colonne
  const handleAddColumn = () => {
    const newColumnKey = `col${columns.length + 1}`;
    const newColumn = {
      title: `Colonne ${columns.length + 1}`,
      dataIndex: newColumnKey,
      key: newColumnKey,
    };

    setColumns([...columns, newColumn]);
    setColumnsToShow([...columnsToShow, newColumn]);

    setData(data.map((item) => ({ ...item, [newColumnKey]: "" })));
  };

  // Gérer la visibilité des colonnes
  const toggleColumnVisibility = (colKey) => {
    setColumnsToShow((prevColumns) =>
      prevColumns.some((col) => col.key === colKey)
        ? prevColumns.filter((col) => col.key !== colKey)
        : [...prevColumns, columns.find((col) => col.key === colKey)]
    );
  };

  return (
    <div className="category-table-container">
      <div className="table-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Rechercher..."
              allowClear
              enterButton="Rechercher"
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>

          <Col xs={24} md={16} className="table-actions">
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
                Ajouter une ligne
              </Button>

              <Dropdown
                overlay={
                  <Menu>
                    {columns.map((col) => (
                      <Menu.Item key={col.key} onClick={() => toggleColumnVisibility(col.key)}>
                        {columnsToShow.some((c) => c.key === col.key) ? "✔ " : ""} {col.title}
                      </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Item onClick={handleAddColumn}>+ Ajouter une colonne</Menu.Item>
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

      <Divider />

      <Table
        dataSource={data}
        columns={columnsToShow}
        loading={loading}
        pagination={{ current: currentPage, pageSize, onChange: setCurrentPage }}
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