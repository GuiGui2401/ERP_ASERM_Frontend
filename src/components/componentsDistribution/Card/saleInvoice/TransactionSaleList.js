import { 
  Button, 
  Card, 
  Table, 
  Space, 
  Dropdown, 
  Menu, 
  Tag,
  Typography,
  Tooltip,
  Badge
} from "antd";
import { 
  EyeOutlined, 
  ColumnHeightOutlined,
  BankOutlined,
  FileTextOutlined,
  CalendarOutlined,
  SwapOutlined,
  DollarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./list-components.css";

const { Text, Title } = Typography;

const TransactionSaleList = ({ list }) => {
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);

  // Définition améliorée des colonnes
  const columns = [
    {
      title: (
        <Space>
          <FileTextOutlined />
          ID
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      render: (id) => (
        <Link to={`/transaction/${id}`}>
          <Tag color="purple" className="id-tag">{id}</Tag>
        </Link>
      ),
      sorter: (a, b) => a.id - b.id,
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
    },
    {
      title: (
        <Space>
          <SwapOutlined />
          Débit
        </Space>
      ),
      dataIndex: "debit",
      key: "debit",
      width: 180,
      render: (debit) => (
        <Space>
          <Badge color="red" />
          <Text>{debit.name}</Text>
        </Space>
      ),
      sorter: (a, b) => a.debit.name.localeCompare(b.debit.name),
    },
    {
      title: (
        <Space>
          <SwapOutlined rotate={180} />
          Crédit
        </Space>
      ),
      dataIndex: "credit",
      key: "credit",
      width: 180,
      render: (credit) => (
        <Space>
          <Badge color="green" />
          <Text>{credit.name}</Text>
        </Space>
      ),
      sorter: (a, b) => a.credit.name.localeCompare(b.credit.name),
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          Montant
        </Space>
      ),
      dataIndex: "amount",
      key: "amount",
      width: 120,
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <Text strong>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => {
        const color = type === 'income' ? 'green' : type === 'expense' ? 'volcano' : 'geekblue';
        return <Tag color={color}>{type}</Tag>;
      },
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: (
        <Space>
          <InfoCircleOutlined />
          Particuliers
        </Space>
      ),
      dataIndex: "particulars",
      key: "particulars",
      ellipsis: { showTitle: false },
      sorter: (a, b) => a.particulars.localeCompare(b.particulars),
      render: (particulars) => (
        <Tooltip title={particulars}>
          <Text>{particulars}</Text>
        </Tooltip>
      )
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

  return (
    <Card 
      className="list-card"
      title={
        <Space align="center">
          <BankOutlined className="card-icon" style={{ color: "#722ed1" }} />
          <span>Informations sur les transactions</span>
        </Space>
      }
      extra={
        list && (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => {
                const col = columns.find(col => col.key === key);
                if (col) colVisibilityClickHandler(col);
              }
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Tooltip title="Visibilité des colonnes">
              <Button 
                type="text" 
                icon={<ColumnHeightOutlined />}
              >
                Colonnes
              </Button>
            </Tooltip>
          </Dropdown>
        )
      }
    >
      <Table
        className="custom-table"
        scroll={{ x: 'max-content' }}
        loading={!list}
        columns={columnsToShow}
        dataSource={list ? addKeys(list) : []}
        pagination={{ 
          position: ['bottomCenter'],
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`
        }}
        size="middle"
      />
    </Card>
  );
};

export default TransactionSaleList;