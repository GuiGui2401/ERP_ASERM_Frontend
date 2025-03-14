import { 
  Button, 
  Dropdown, 
  Menu, 
  Segmented, 
  Table, 
  Card, 
  Input, 
  Space, 
  Tooltip, 
  Badge,
  Typography,
  Row,
  Col,
  Statistic
} from "antd";
import { 
  SearchOutlined, 
  DownloadOutlined, 
  EyeOutlined, 
  FilterOutlined,
  UserOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./customer.css";

import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import GetTotalCustomers from "../../../api/getTotalCustomers";
import { loadAllCustomer } from "../../../redux/reduxDistribution/actions/customer/getCustomerAction";

import moment from "moment";

const { Title, Text } = Typography;

function CustomTable({ list, total, status, onSearch }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
      width: 80,
    },
    {
      title: "Nom de l'entreprise",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Link to={`/customer/${record.id}`}>
            <Text strong>{name}</Text>
          </Link>
          {record.status === false && <Badge status="error" text="Inactif" />}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      ellipsis: true,
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "Non spécifié",
      sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
      sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "Non spécifié",
      responsive: ["md"],
      ellipsis: true,
    },
    {
      title: "Type de Client",
      dataIndex: "type_customer",
      key: "type_customer",
      render: (type) => (
        <Badge 
          color={type === "Distributeur" ? "blue" : "purple"} 
          text={type || "Non spécifié"} 
        />
      ),
      filters: [
        { text: 'Distributeur', value: 'Distributeur' },
        { text: 'Pharmacie', value: 'Pharmacie' },
      ],
      filteredValue: filteredInfo.type_customer || null,
      onFilter: (value, record) => record.type_customer === value,
      sorter: (a, b) => (a.type_customer || '').localeCompare(b.type_customer || ''),
      sortOrder: sortedInfo.columnKey === 'type_customer' && sortedInfo.order,
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
      responsive: ["lg"],
      render: (ville) => ville || "Non spécifié",
      sorter: (a, b) => (a.ville || '').localeCompare(b.ville || ''),
      sortOrder: sortedInfo.columnKey === 'ville' && sortedInfo.order,
    },
    {
      title: "Ajouté le",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
      responsive: ["xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Voir les détails">
            <Link to={`/customer/${record.id}`}>
              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                size="small"
              />
            </Link>
          </Tooltip>
        </Space>
      ),
      width: 100,
      fixed: 'right',
    }
  ];

  useEffect(() => {
    setColumnItems(
      columns.map(item => ({
        key: item.key,
        label: <span>{item.title}</span>,
      }))
    );
    setColumnsToShow(columns);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

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

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div className="customer-table">
      <div className="table-controls mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Rechercher un client..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={16} lg={18}>
            <Space wrap>
              <Tooltip title="Effacer les filtres">
                <Button 
                  onClick={clearFilters} 
                  icon={<FilterOutlined />}
                >
                  Réinitialiser
                </Button>
              </Tooltip>
              
              <Dropdown
                menu={{
                  items: columnItems,
                  onClick: colVisibilityClickHandler
                }}
                placement="bottomLeft"
              >
                <Button className="column-visibility">
                  Visibilité des colonnes
                </Button>
              </Dropdown>
              
              {list && (
                <Tooltip title="Télécharger en CSV">
                  <CSVLink
                    data={list}
                    filename={`clients_${moment().format('YYYY-MM-DD')}.csv`}
                  >
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />}
                    >
                      Exporter
                    </Button>
                  </CSVLink>
                </Tooltip>
              )}
            </Space>
          </Col>
        </Row>
      </div>
      
      <Table
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} clients`,
          onChange: (page, limit) => {
            dispatch(loadAllCustomer({ page, limit, status }));
          },
        }}
        onChange={handleChange}
        scroll={{ x: 'max-content' }}
        loading={!list}
        size="middle"
        bordered
      />
    </div>
  );
}

const GetAllCust = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.customers.list);
  const [total, setTotal] = useState(0);
  const [activeTotal, setActiveTotal] = useState(0);
  const [inactiveTotal, setInactiveTotal] = useState(0);
  const [status, setStatus] = useState("true");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(loadAllCustomer({ page: 1, limit: 10, status: status, q: searchQuery }));
  }, [dispatch, status, searchQuery]);

  useEffect(() => {
    // Fetch total counts
    Promise.all([
      GetTotalCustomers(),
      GetTotalCustomers("true"),
      GetTotalCustomers("false")
    ]).then(([totalCount, activeCount, inactiveCount]) => {
      setTotal(totalCount);
      setActiveTotal(activeCount);
      setInactiveTotal(inactiveCount);
    });
  }, [list]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <Card 
      className="shadow-sm" 
      bordered={false}
      title={
        <div className="d-flex justify-content-between align-items-center">
          <Title level={4} className="mb-0">Liste des comptes clients

</Title>
          <Segmented
            className="segmented-control"
            size="middle"
            options={[
              {
                label: (
                  <Space>
                    <UserOutlined />
                    <span className="segmented-label">Actifs</span>
                    <Badge count={activeTotal} style={{ backgroundColor: '#52c41a' }} />
                  </Space>
                ),
                value: "true",
              },
              {
                label: (
                  <Space>
                    <UserSwitchOutlined />
                    <span className="segmented-label">Inactifs</span>
                    <Badge count={inactiveTotal} style={{ backgroundColor: '#ff4d4f' }} />
                  </Space>
                ),
                value: "false",
              },
            ]}
            value={status}
            onChange={handleStatusChange}
          />
        </div>
      }
    >
      <Row gutter={[16, 24]} className="mb-4">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm statistic-card">
            <Statistic
              title="Total Clients"
              value={total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm statistic-card">
            <Statistic
              title="Comptes clients Actifs"
              value={activeTotal}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm statistic-card">
            <Statistic
              title="Comptes clients Inactifs"
              value={inactiveTotal}
              valueStyle={{ color: '#cf1322' }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <CustomTable 
        list={list} 
        total={status === "true" ? activeTotal : inactiveTotal} 
        status={status} 
        onSearch={handleSearch}
      />
      
      <style jsx>{`
        .segmented-control {
          border: 1px solid #f0f0f0;
          border-radius: 2px;
        }
        
        .segmented-label {
          margin: 0 4px;
        }
        
        .statistic-card {
          text-align: center;
          height: 100%;
        }
        
        @media (max-width: 768px) {
          .segmented-label {
            display: none;
          }
        }
      `}</style>
    </Card>
  );
};

export default GetAllCust;