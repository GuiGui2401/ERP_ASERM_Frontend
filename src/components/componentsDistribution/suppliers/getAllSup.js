import { 
  Button, 
  Dropdown, 
  Menu, 
  Segmented, 
  Table, 
  Input, 
  Card, 
  Space, 
  Typography, 
  Tag, 
  Avatar, 
  Tooltip,
  Badge
} from "antd";
import { 
  UserOutlined, 
  PlusOutlined, 
  DownloadOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined
} from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import GetTotalSuppliers from "../../../api/getTotalSuppliers";
import { loadSuppliers } from "../../../redux/reduxDistribution/actions/supplier/getSuppliersAction";
import "./suppliers.css";

const { Title, Text } = Typography;
const { Search } = Input;

function CustomTable({ list, total, status }) {
  const dispatch = useDispatch();
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Génère une couleur basée sur le nom du fournisseur pour l'avatar
  const getAvatarColor = (name) => {
    if (!name) return "#1890ff";
    
    // Simple fonction de hachage pour une couleur cohérente
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#1890ff', // blue
      '#52c41a', // green
      '#722ed1', // purple
      '#eb2f96', // pink
      '#fa8c16', // orange
      '#13c2c2', // cyan
      '#fa541c'  // volcano
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const columns = [
    {
      title: "Fournisseur",
      dataIndex: "name",
      key: "name",
      fixed: 'left',
      width: 220,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) || 
              (record.phone && record.phone.toLowerCase().includes(value.toLowerCase())) ||
              (record.address && record.address.toLowerCase().includes(value.toLowerCase()));
      },
      render: (name, record) => (
        <Link to={`/supplier/${record.id}`} className="supplier-name-link">
          <Space>
            <Avatar 
              style={{ backgroundColor: getAvatarColor(name) }}
              icon={<UserOutlined />}
            />
            <span>{name}</span>
          </Space>
        </Link>
      ),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone?.localeCompare(b.phone),
      sortDirections: ["ascend", "descend"],
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          <Text copyable>{phone}</Text>
        </Space>
      )
    },
    {
      title: "Adresse",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
      sorter: (a, b) => a.address?.localeCompare(b.address),
      sortDirections: ["ascend", "descend"],
      render: (address) => (
        <Space>
          <EnvironmentOutlined />
          <span>{address}</span>
        </Space>
      )
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir les détails">
            <Link to={`/supplier/${record.id}`}>
              <Button type="primary" size="small">
                Détails
              </Button>
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  useEffect(() => {
    setColumnItems(menuItems);
    setColumnsToShow(columns);
  }, []);

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

  const menuItems = columns.map((item) => {
    return {
      key: item.key,
      label: (
        <Space>
          <span>{item.title}</span>
          {columnsToShow.find(col => col.key === item.key) && (
            <Tag color="green" size="small">Visible</Tag>
          )}
        </Space>
      )
    };
  });

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div>
      <div className="table-header" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <Search
            placeholder="Rechercher un fournisseur..."
            allowClear
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchText("");
              }
            }}
            style={{ width: 250 }}
          />
          
          <Space>
            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  const col = columns.find(col => col.key === key);
                  if (col) colVisibilityClickHandler(col);
                }
              }}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Button icon={<FilterOutlined />}>
                Colonnes
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>
      
      <Table
        scroll={{ x: 800 }}
        loading={!list}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} fournisseurs`,
          onChange: (page, limit) => {
            dispatch(loadSuppliers({ page, limit, status }));
          },
        }}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
        rowClassName="supplier-row"
      />
    </div>
  );
}

const GetAllSup = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.suppliers.list);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(loadSuppliers({ status: "true", page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    GetTotalSuppliers().then((res) => setTotal(res));
  }, [list]);

  const [status, setStatus] = useState("true");
  const onChange = (value) => {
    setStatus(value);
    dispatch(loadSuppliers({ status: value, page: 1, limit: 10 }));
  };
  
  return (
    <Card 
      className="table-card"
      title={
        <Space>
          <UserOutlined style={{ fontSize: "18px" }} />
          <Title level={4} style={{ marginBottom: 0 }}>Liste des fournisseurs</Title>
        </Space>
      }
      extra={
        <Space>
          {list && (
            <CSVLink
              data={list}
              filename="suppliers.csv"
            >
              <Button 
                type="default" 
                icon={<DownloadOutlined />}
              >
                CSV
              </Button>
            </CSVLink>
          )}
          
          <Segmented
            options={[
              {
                label: "Actifs",
                value: "true",
                icon: <Badge status="success" />
              },
              {
                label: "Inactifs",
                value: "false",
                icon: <Badge status="default" />
              },
            ]}
            value={status}
            onChange={onChange}
          />
          
          <Link to="/supplier/add">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
            >
              Ajouter
            </Button>
          </Link>
        </Space>
      }
    >
      <CustomTable list={list} total={total} status={status} />
    </Card>
  );
};

export default GetAllSup;