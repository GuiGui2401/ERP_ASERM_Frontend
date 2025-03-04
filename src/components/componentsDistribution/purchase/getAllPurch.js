import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";
import "./purchase.css";

import { 
  Button, 
  DatePicker, 
  Dropdown, 
  Menu, 
  Segmented, 
  Table,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Tooltip,
  Input,
  Statistic,
  Badge
} from "antd";
import { 
  ShoppingCartOutlined, 
  CalendarOutlined, 
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  PlusOutlined,
  RightOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllPurchase } from "../../../redux/reduxDistribution/actions/purchase/getPurchaseAction";
import DashboardCard from "../Card/DashboardCard";
import "./get-all-purch.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function CustomTable({ list, total, status, setStatus, startdate, enddate }) {
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const onChange = (value) => {
    setStatus(value);
    dispatch(
      loadAllPurchase({
        status: value,
        page: 1,
        limit: 10,
        startdate,
        enddate,
      })
    );
  };

  const columns = [
    {
      title: (
        <Space>
          <ShoppingCartOutlined />
          ID
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left",
      render: (id) => (
        <Link to={`/purchase/${id}`} className="purchase-link">
          <Tag color="blue" className="purchase-id">#{id}</Tag>
        </Link>
      ),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          Date
        </Space>
      ),
      dataIndex: "date",
      key: "date",
      width: 160,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text strong>{moment(date).format("DD/MM/YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{moment(date).format("HH:mm")}</Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Fournisseur",
      dataIndex: "supplier",
      key: "supplier_id",
      width: 200,
      render: (supplier) => (
        <Link to={`/supplier/${supplier.id}`} className="supplier-link">
          {supplier?.name}
        </Link>
      ),
      sorter: (a, b) => a.supplier.name.localeCompare(b.supplier.name),
      sortDirections: ["ascend", "descend"],
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.supplier.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Montant total",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 150,
      align: "right",
      sorter: (a, b) => a.total_amount - b.total_amount,
      sortDirections: ["ascend", "descend"],
      render: (amount) => (
        <Text strong>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: "Remise",
      dataIndex: "discount",
      key: "discount",
      width: 120,
      align: "right",
      sorter: (a, b) => a.discount - b.discount,
      sortDirections: ["ascend", "descend"],
      render: (discount) => (
        discount > 0 ? (
          <Tag color="volcano">{discount.toLocaleString('fr-FR')} €</Tag>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: "Montant à payer",
      dataIndex: "due_amount",
      key: "due_amount",
      width: 150,
      align: "right",
      sorter: (a, b) => a.due_amount - b.due_amount,
      sortDirections: ["ascend", "descend"],
      render: (amount) => {
        if (amount === 0) {
          return <Badge status="success" text="Payé" />;
        }
        return <Text type="danger" strong>{amount.toLocaleString('fr-FR')} €</Text>;
      }
    },
    {
      title: "Montant payé",
      dataIndex: "paid_amount",
      key: "paid_amount",
      width: 150,
      align: "right",
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      sortDirections: ["ascend", "descend"],
      render: (amount) => (
        <Text style={{ color: '#52c41a' }}>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      width: 120,
      fixed: "right",
      render: (id, record) => (
        <Space>
          <Link to={`/purchase/${id}`}>
            <Button 
              type="default" 
              size="small" 
              icon={<RightOutlined />}
              className="view-button"
            >
              Voir
            </Button>
          </Link>
          {record.due_amount > 0 && (
            <Link to={`/payment/supplier/${id}`}>
              <Button 
                type="primary" 
                size="small"
                className="payment-button"
              >
                Paiement
              </Button>
            </Link>
          )}
        </Space>
      ),
    },
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
          <span>{typeof item.title === 'string' ? item.title : item.title.props?.children[1]}</span>
          {columnsToShow.find(col => col.key === item.key) && (
            <Tag color="green" size="small">Visible</Tag>
          )}
        </Space>
      ),
    };
  });

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  const CSVlist = list?.map((i) => ({
    ...i,
    supplier: i?.supplier?.name,
  }));

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Card className="purchase-list-card">
      <div className="purchase-list-header">
        <div className="title-section">
          <Title level={5}>
            <Space>
              <ShoppingCartOutlined />
              HISTORIQUE DES ACHATS
            </Space>
          </Title>

          <Input 
            placeholder="Rechercher par fournisseur" 
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            allowClear
            className="search-input"
          />
        </div>

        <div className="actions-section">
          {list && (
            <Tooltip title="Télécharger les données au format CSV">
              <CSVLink
                data={CSVlist}
                filename="purchase-list"
                className="csv-button"
              >
                <Button 
                  icon={<DownloadOutlined />}
                  className="download-button"
                >
                  CSV
                </Button>
              </CSVLink>
            </Tooltip>
          )}

          <Segmented
            className="status-segmented"
            size="middle"
            options={[
              {
                label: (
                  <Space>
                    <Badge status="processing" />
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
            onChange={onChange}
          />

          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => {
                const col = columns.find(col => col.key === key);
                if (col) colVisibilityClickHandler(col);
              }
            }}
            trigger={["click"]}
          >
            <Button 
              icon={<FilterOutlined />}
              className="filter-button"
            >
              Colonnes
            </Button>
          </Dropdown>
        </div>
      </div>

      <Table
        className="purchase-table"
        scroll={{ x: 'max-content' }}
        loading={!list}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          total: total ? total : 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`,
          onChange: (page, limit) => {
            dispatch(
              loadAllPurchase({ status, page, limit, startdate, enddate })
            );
          },
        }}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
        size="middle"
        summary={pageData => {
          if (!pageData.length) return null;
          
          // Calculate totals for visible data
          const totalAmount = pageData.reduce((sum, item) => sum + item.total_amount, 0);
          const totalPaid = pageData.reduce((sum, item) => sum + item.paid_amount, 0);
          const totalDue = pageData.reduce((sum, item) => sum + item.due_amount, 0);
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="summary-row">
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>Total de la page</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <Text strong>{totalAmount.toLocaleString('fr-FR')} €</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} align="right">
                  <Text type="danger" strong>{totalDue.toLocaleString('fr-FR')} €</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <Text style={{ color: '#52c41a' }} strong>{totalPaid.toLocaleString('fr-FR')} €</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </Card>
  );
}

const GetAllPurch = () => {
  const [startdate, setStartdate] = useState(moment().startOf("month"));
  const [enddate, setEnddate] = useState(moment().endOf("month"));

  const dispatch = useDispatch();
  const list = useSelector((state) => state.purchases.list);
  const total = useSelector((state) => state.purchases.total);
  const [status, setStatus] = useState("true");

  useEffect(() => {
    dispatch(
      loadAllPurchase({
        status: true,
        page: 1,
        limit: 10,
        startdate: startdate,
        enddate: enddate,
      })
    );
  }, []);

  const onCalendarChange = (dates) => {
    if (dates && dates.length === 2) {
      const newStartdate = dates[0].format("YYYY-MM-DD HH:mm");
      const newEnddate = dates[1].format("YYYY-MM-DD HH:mm");
      
      setStartdate(newStartdate);
      setEnddate(newEnddate);

      dispatch(
        loadAllPurchase({
          status: status,
          page: 1,
          limit: 10,
          startdate: newStartdate,
          enddate: newEnddate,
        })
      );
    }
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div className="purchase-page-container">
      <div className="page-header">
        <div className="header-content">
          <Space direction="vertical" size={4}>
            <Title level={3}>
              <Space>
                <ShoppingCartOutlined />
                Liste des factures d'achat
              </Space>
            </Title>
            <Text type="secondary">
              Consultez et gérez toutes vos factures d'achat
            </Text>
          </Space>

          <div className="header-actions">
            <RangePicker
              value={[moment(startdate), moment(enddate)]}
              onCalendarChange={onCalendarChange}
              format="DD/MM/YYYY"
              className="date-range-picker"
            />
            
            <Link to="/purchase">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                className="add-purchase-button"
              >
                Nouvelle facture
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <DashboardCard information={total?._sum} count={total?._count} />
      </div>

      <CustomTable
        list={list}
        total={total?._count?.id}
        startdate={startdate}
        enddate={enddate}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
};

export default GetAllPurch;