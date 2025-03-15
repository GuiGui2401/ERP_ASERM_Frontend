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

const { Title, Text } = Typography;
const { Search } = Input;

function CustomTable({ list, total }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Définir les colonnes du tableau
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
      width: 80,
      className: 'column-id'
    },
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Avatar 
            shape="square" 
            size="small" 
            className="category-avatar"
            style={{ 
              backgroundColor: getRandomColor(record.id),
              verticalAlign: 'middle' 
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Link to={`/product-category/${record.id}`} className="category-link">
            {name}
          </Link>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      }
    },
    {
      title: "Produits",
      dataIndex: "productsCount",
      key: "productsCount",
      render: (_, record) => (
        <Badge count={record.productsCount || 0} showZero overflowCount={999} className="products-badge" />
      ),
      width: 100,
      align: "center"
    },
    {
      title: "Créé le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <Space direction="vertical" size={0}>
          <Text>{moment(createdAt).format("DD/MM/YYYY")}</Text>
          <Text type="secondary">{moment(createdAt).format("HH:mm")}</Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["ascend", "descend"],
      responsive: ["md"],
      width: 150
    },
    {
      title: "Statut",
      key: "status",
      render: (_, record) => {
        // On détermine le statut basé sur le nombre de produits (fictif ici)
        const hasProducts = record.productsCount > 0;
        return (
          <Tag color={hasProducts ? "success" : "default"}>
            {hasProducts ? "Active" : "Inactive"}
          </Tag>
        );
      },
      width: 100,
      align: "center",
      responsive: ["lg"]
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Voir les détails">
            <Link to={`/product-category/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} className="action-button" />
            </Link>
          </Tooltip>
          
          <Tooltip title="Modifier">
            <Link to={`/product-category/${record.id}/update`} state={{ data: record }}>
              <Button type="text" icon={<EditOutlined />} className="action-button" />
            </Link>
          </Tooltip>
          
          <Tooltip title="Supprimer">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              className="action-button"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
      width: 150,
      align: "center"
    }
  ];

  // Générer une couleur aléatoire basée sur l'ID
  const getRandomColor = (id) => {
    const colors = [
      '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
      '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#fadb14'
    ];
    return colors[id % colors.length];
  };

  // Initialiser les colonnes à afficher
  useEffect(() => {
    setColumnsToShow(columns);
    setColumnItems(menuItems);
    
    // Ajouter un comptage fictif de produits pour la démo
    if (list) {
      list.forEach(category => {
        category.productsCount = Math.floor(Math.random() * 20);
      });
    }
  }, [list]);

  // Gérer la suppression (factice)
  const handleDelete = (id) => {
    console.log(`Demande de suppression de la Marque ${id}`);
    // Ici, vous implémenterez la vraie logique de suppression
  };

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
  };

  // Gérer le changement de page
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setLoading(true);
    dispatch(loadAllProductCategory({ page, limit: pageSize }))
      .finally(() => setLoading(false));
  };

  // Recharger les données
  const handleReload = () => {
    setLoading(true);
    setSearchText("");
    dispatch(loadAllProductCategory({ page: 1, limit: pageSize }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="category-table-container">
      <div className="table-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Rechercher une Marque..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="search-input"
            />
          </Col>
          
          <Col xs={24} md={16} className="table-actions">
            <Space wrap>
              <Tooltip title="Actualiser">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReload}
                  loading={loading}
                >
                  Actualiser
                </Button>
              </Tooltip>
              
              <Tooltip title="Ajouter une Marque">
                <Link to="/product-category?tab=add">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    className="add-button"
                  >
                    Ajouter
                  </Button>
                </Link>
              </Tooltip>
              <UploadButton />
              
              {list && (
                <Tooltip title="Exporter en CSV">
                  <CSVLink
                    data={list}
                    filename={`categories-${moment().format('YYYY-MM-DD')}`}
                    className="csv-link"
                  >
                    <Button icon={<ExportOutlined />}>
                      Exporter
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
                <Button icon={<SettingOutlined />}>
                  Colonnes
                </Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </div>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div className="table-content">
        <Table
          columns={columnsToShow}
          dataSource={addKeys(list)}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            total: total || (list?.length || 0),
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} Marques`,
            onChange: handlePageChange,
            onShowSizeChange: (current, size) => setPageSize(size),
          }}
          size="middle"
          className="categories-table"
          rowClassName={(record, index) => index % 2 === 0 ? "even-row" : "odd-row"}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucune Marque trouvée"
              />
            ),
          }}
          rowKey="id"
          expandable={{
            expandedRowRender: record => (
              <div className="expanded-row">
                <p>
                  <Text strong>ID:</Text> {record.id}
                </p>
                <p>
                  <Text strong>Date de création:</Text> {moment(record.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </p>
                <p>
                  <Text strong>Description:</Text> {record.description || "Aucune description"}
                </p>
              </div>
            ),
          }}
        />
      </div>
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