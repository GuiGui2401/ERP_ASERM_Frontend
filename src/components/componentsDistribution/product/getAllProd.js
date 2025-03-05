import React, { useState, useEffect } from "react";
import { 
  Button, 
  Dropdown, 
  Menu, 
  Segmented, 
  Table, 
  Space, 
  Input, 
  Card, 
  Tag, 
  Tooltip, 
  Typography, 
  Row, 
  Col, 
  Badge, 
  Divider, 
  Statistic, 
  Empty,
  Select,
  Alert
} from "antd";
import { 
  DownloadOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BarcodeOutlined, 
  ShopOutlined, 
  AppstoreOutlined,
  PlusOutlined,
  DollarOutlined,
  SortAscendingOutlined,
  EllipsisOutlined,
  ExportOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import getTotalProduct from "../../../api/getAllApis/getTotalProduct";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import GenerateBarcodePopUp from "./generateBarcodePopUp";
import NotificationIcon from "../notification/NotificationIcon";
import "./product.css";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function CustomTable({ list, total, status }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  // Définition des colonnes du tableau
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (imageUrl) => (
        <div className="product-image-container">
          {imageUrl ? (
            <img 
              className="product-image" 
              alt="product" 
              src={imageUrl} 
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
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Link to={`/product/${record.id}`} className="product-name-link">
            {name}
          </Link>
          {record.product_category && (
            <Tag color="blue" className="category-tag">
              {record.product_category.name}
            </Tag>
          )}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
          (record.product_category?.name && record.product_category.name.toLowerCase().includes(value.toLowerCase()));
      },
    },
    {
      title: "Catégorie",
      dataIndex: "product_category",
      key: "product_category",
      render: (product_category) => product_category?.name,
      sorter: (a, b) => {
        if (!a.product_category?.name || !b.product_category?.name) return 0;
        return a.product_category.name.localeCompare(b.product_category.name);
      },
      sortOrder: sortedInfo.columnKey === "product_category" && sortedInfo.order,
      filters: list ? 
        [...new Set(list.filter(item => item.product_category?.name).map(item => item.product_category.name))]
          .sort()
          .map(name => ({ text: name, value: name })) 
        : [],
      onFilter: (value, record) => record.product_category?.name === value,
      responsive: ["md"],
    },
    {
      title: "Gamme",
      dataIndex: "unit_type",
      key: "unit_type",
      sorter: (a, b) => {
        if (!a.unit_type || !b.unit_type) return 0;
        return a.unit_type.localeCompare(b.unit_type);
      },
      sortOrder: sortedInfo.columnKey === "unit_type" && sortedInfo.order,
      responsive: ["lg"],
    },
    {
      title: "Gencode EAN",
      dataIndex: "gencode",
      key: "gencode",
      render: (gencode) => gencode || 'N/A',
      sorter: (a, b) => {
        if (!a.gencode || !b.gencode) return 0;
        return a.gencode.localeCompare(b.gencode);
      },
      sortOrder: sortedInfo.columnKey === "gencode" && sortedInfo.order,
      responsive: ["lg"],
    },
    {
      title: "Fournisseur",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier) => supplier?.name || 'N/A',
      sorter: (a, b) => {
        if (!a.supplier?.name || !b.supplier?.name) return 0;
        return a.supplier.name.localeCompare(b.supplier.name);
      },
      sortOrder: sortedInfo.columnKey === "supplier" && sortedInfo.order,
      responsive: ["lg"],
    },
    {
      title: (
        <Tooltip title="Quantité commandée vs reçue">
          <span>Quantité</span>
        </Tooltip>
      ),
      key: "quantities",
      align: "center",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>Commandée: <strong>{record.quantity || 0}</strong></Text>
          <Text>Reçue: <strong>{record.reorder_quantity || 0}</strong></Text>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: (
        <Tooltip title="Prix d'achat et prix de vente">
          <span>Prix</span>
        </Tooltip>
      ),
      key: "prices",
      align: "right",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary">Achat: {parseFloat(record.purchase_price || 0).toFixed(2)} FCFA</Text>
          <Text strong>Vente: {parseFloat(record.sale_price || 0).toFixed(2)} FCFA</Text>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir les détails">
            <Link to={`/product/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          
          <Tooltip title="Générer code-barre">
            <Button 
              type="text" 
              icon={<BarcodeOutlined />} 
              onClick={() => <GenerateBarcodePopUp sku={record.sku || 0} />}
            />
          </Tooltip>
          
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />}>
                  <Link to={`/product/edit/${record.id}`}>Modifier</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  key="delete" 
                  icon={<DeleteOutlined />} 
                  danger
                >
                  Supprimer
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<EllipsisOutlined />} 
              className="more-actions-button"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Initialiser les colonnes à afficher
  useEffect(() => {
    setColumnItems(menuItems);
    setColumnsToShow(columns);
  }, []);

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
  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  // Gérer le changement de tri
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // Gérer la recherche
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Recharger les données
  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");
    setSortedInfo({});
    dispatch(loadProduct({ status, page: 1, limit: pageSize }))
      .finally(() => setLoading(false));
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
              <Tooltip title="Actualiser">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Actualiser
                </Button>
              </Tooltip>
              
              <Tooltip title="Exporter en CSV">
                {list && (
                  <CSVLink
                    data={list.map(item => ({
                      ...item,
                      product_category: item?.product_category?.name || 'N/A',
                      supplier: item?.supplier?.name || 'N/A'
                    }))}
                    filename={`produits-${new Date().toISOString().slice(0, 10)}`}
                    className="csv-link"
                  >
                    <Button icon={<ExportOutlined />}>
                      Exporter
                    </Button>
                  </CSVLink>
                )}
              </Tooltip>
              
              <Dropdown
                overlay={
                  <Menu onClick={colVisibilityClickHandler} items={menuItems} />
                }
                placement="bottomRight"
              >
                <Button icon={<AppstoreOutlined />}>
                  Colonnes
                </Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="table-content">
        <Table
          columns={columnsToShow}
          dataSource={list ? addKeys(list) : []}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} produits`,
            onChange: (page, pageSize) => {
              setLoading(true);
              setPageSize(pageSize);
              dispatch(loadProduct({ status, page, limit: pageSize }))
                .finally(() => setLoading(false));
            },
          }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
          size="middle"
          rowClassName={(record, index) => index % 2 === 0 ? "even-row" : "odd-row"}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucun produit trouvé"
              />
            ),
          }}
          className="products-table"
        />
      </div>
    </div>
  );
}

const GetAllProd = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.products.list);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("true");
  const [loading, setLoading] = useState(true);
  
  // Charger la liste des produits au montage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(loadProduct({ status: "true", page: 1, limit: 10 }));
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [dispatch]);
  
  // Charger le total des produits
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const totalCount = await getTotalProduct();
        setTotal(totalCount);
      } catch (error) {
        console.error("Erreur lors du chargement du total des produits:", error);
      }
    };
    
    fetchTotal();
  }, [list]);
  
  // Gérer le changement de statut (actif/inactif)
  const handleStatusChange = (value) => {
    setStatus(value);
    setLoading(true);
    dispatch(loadProduct({ status: value, page: 1, limit: 10 }))
      .finally(() => setLoading(false));
  };
  
  // Préparer les données pour l'export CSV
  const CSVlist = list?.map((i) => ({
    ...i,
    product_category: i?.product_category?.name || 'N/A',
    supplier: i?.supplier?.name || 'N/A'
  }));

  return (
    <Card 
      className="product-list-card"
      title={
        <Space>
          <ShopOutlined className="card-icon" />
          <Title level={4} className="card-title">Liste des produits</Title>
        </Space>
      }
    >
      <div className="card-header">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Text strong>Statut:</Text>
                <Segmented
                  options={[
                    {
                      label: (
                        <Space>
                          <Badge status="success" />
                          <span>Actifs</span>
                        </Space>
                      ),
                      value: "true",
                    },
                    {
                      label: (
                        <Space>
                          <Badge status="default" />
                          <span>Inactifs</span>
                        </Space>
                      ),
                      value: "false",
                    },
                  ]}
                  value={status}
                  onChange={handleStatusChange}
                  className="status-segmented"
                />
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <div className="stats-container">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="Total" 
                    value={total} 
                    loading={loading}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Actifs" 
                    value={status === "true" ? list?.length || 0 : "--"}
                    loading={loading}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="En alerte" 
                    value={5} // Exemple, à calculer selon vos besoins
                    loading={loading}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<NotificationIcon list={list} />}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      
      <Divider />
      
      <CustomTable list={list} total={total} status={status} />
    </Card>
  );
};

export default GetAllProd;