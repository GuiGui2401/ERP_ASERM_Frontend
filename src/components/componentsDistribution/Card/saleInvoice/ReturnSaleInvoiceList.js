import { 
  Button, 
  Card, 
  Table, 
  Space, 
  Dropdown, 
  Menu, 
  Tag,
  Typography,
  Tooltip
} from "antd";
import { 
  EyeOutlined, 
  ColumnHeightOutlined,
  RollbackOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  MessageOutlined
} from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReturnSaleInvoiceProductList from "../../popUp/returnSaleProductList";
import "./list-components.css";

const { Text, Title } = Typography;

const ReturnSaleInvoiceList = ({ list }) => {
  const [columnItems, setColumnItems] = useState([]);
  const [columnsToShow, setColumnsToShow] = useState([]);

  // Suppression du console.log de production
  // console.log("list received in returnsaleinvoicelist:", list);

  // Définition améliorée des colonnes
  const columns = [
    {
      title: "Details",
      dataIndex: "returnSaleInvoiceProduct",
      key: "returnSaleInvoiceProduct",
      width: 100,
      fixed: "left",
      render: (returnSaleInvoiceProduct) => (
        <Tooltip title="Voir les détails">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            className="details-button"
            onClick={(e) => {
              // Empêcher la propagation pour éviter des conflits avec le tri des colonnes
              e.stopPropagation();
            }}
          >
            Détails
          </Button>
        </Tooltip>
      ),
      // Composant de PopUp rendu seulement quand nécessaire
      onCell: (record) => ({
        onClick: (e) => {
          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SPAN') {
            ReturnSaleInvoiceProductList({ list: record.returnSaleInvoiceProduct });
          }
        }
      })
    },
    {
      title: (
        <Space>
          <FileTextOutlined />
          ID
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      render: (id) => <Tag color="purple">{id}</Tag>
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
          <DollarOutlined />
          Montant Total
        </Space>
      ),
      dataIndex: "total_amount",
      key: "total_amount",
      width: 130,
      align: "right",
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount) => (
        <Text strong>{amount.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: (
        <Space>
          <MessageOutlined />
          Note
        </Space>
      ),
      dataIndex: "note",
      key: "note",
      ellipsis: { showTitle: false },
      sorter: (a, b) => a.note.localeCompare(b.note),
      render: (note) => (
        <Tooltip title={note}>
          <Text>{note}</Text>
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
          <RollbackOutlined className="card-icon" style={{ color: "#eb2f96" }} />
          <span>Informations de vente de retour</span>
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

export default ReturnSaleInvoiceList;