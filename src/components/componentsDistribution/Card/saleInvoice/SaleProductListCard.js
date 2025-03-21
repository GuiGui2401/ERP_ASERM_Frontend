import { 
  InputNumber, 
  Table, 
  Space, 
  Typography, 
  Card,
  Tag,
  Tooltip,
  Badge
} from "antd";
import {
  ShoppingOutlined,
  FileTextOutlined,
  TagOutlined,
  NumberOutlined,
  DollarOutlined,
  CalculatorOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import "./list-components.css";

const { Text, Title } = Typography;

const SaleProductListCard = ({ list, updateReturn, returnOnChange }) => {
  // Définition améliorée des colonnes
  const columns = [
    {
      title: (
        <Space>
          <FileTextOutlined />
          ID
        </Space>
      ),
      dataIndex: "product_id",
      key: "product_id",
      width: 80,
      render: (id) => <Tag color="blue">{id}</Tag>,
      sorter: (a, b) => a.product_id - b.product_id,
    },
    {
      title: (
        <Space>
          <TagOutlined />
          Nom
        </Space>
      ),
      dataIndex: "product",
      key: "product.name",
      width: 200,
      render: (product) => (
        <Link to={`/product/${product.id}`} className="product-link">
          <Text ellipsis={{ tooltip: product.name }}>{product.name}</Text>
        </Link>
      ),
      sorter: (a, b) => a.product.name.localeCompare(b.product.name),
    },
    {
      title: (
        <Space>
          <NumberOutlined />
          Quantité
        </Space>
      ),
      dataIndex: "product_quantity",
      key: "product_quantity",
      width: 100,
      align: "center",
      sorter: (a, b) => a.product_quantity - b.product_quantity,
      render: (qty) => (
        <Badge 
          count={qty} 
          showZero 
          overflowCount={9999}
          style={{ backgroundColor: '#52c41a' }}
        />
      )
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          Prix Unitaire
        </Space>
      ),
      dataIndex: "product_sale_price",
      key: "product_sale_price",
      width: 120,
      align: "right",
      sorter: (a, b) => a.product_sale_price - b.product_sale_price,
      render: (price) => (
        <Text>{price.toLocaleString('fr-FR')} €</Text>
      )
    },
    {
      title: (
        <Space>
          <CalculatorOutlined />
          Prix Total
        </Space>
      ),
      key: "total_price",
      dataIndex: "",
      width: 120,
      align: "right",
      render: ({
        product_quantity,
        product_sale_price,
        remain_quantity,
        return_quantity,
      }) => {
        const totalPrice = return_quantity 
          ? remain_quantity * product_sale_price
          : product_sale_price * product_quantity;
        
        return <Text strong>{totalPrice.toLocaleString('fr-FR')} €</Text>;
      },
      sorter: (a, b) => {
        const aPrice = a.return_quantity
          ? a.remain_quantity * a.product_sale_price
          : a.product_sale_price * a.product_quantity;
        const bPrice = b.return_quantity
          ? b.remain_quantity * b.product_sale_price
          : b.product_sale_price * b.product_quantity;
        return aPrice - bPrice;
      },
    },
  ];

  // Insérer la colonne de retour si nécessaire
  if (updateReturn) {
    columns.splice(4, 0, {
      title: (
        <Tooltip title="Entrez la quantité à retourner">
          <Space>
            <RollbackOutlined />
            Qté Retournée
          </Space>
        </Tooltip>
      ),
      dataIndex: "return_quantity",
      key: "return_quantity",
      width: 150,
      align: "center",
      render: (
        value,
        { product_id, product_quantity, product_sale_price: price }
      ) => {
        return (
          <InputNumber
            onChange={(value) =>
              returnOnChange({ id: product_id, value, price })
            }
            className="return-input"
            placeholder="Qté Retour"
            max={product_quantity}
            min={0}
            value={value}
            size="middle"
            controls
          />
        );
      },
    });
  }

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id || i.product_id }));

  return (
    <Card 
      className="list-card"
      title={
        <Space align="center">
          <ShoppingOutlined className="card-icon" />
          <span>Informations sur les produits vendus</span>
        </Space>
      }
    >
      <Table
        className="custom-table"
        scroll={{ x: 'max-content' }}
        loading={!list}
        columns={columns}
        dataSource={list ? addKeys(list) : []}
        pagination={{ 
          position: ['bottomCenter'],
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`
        }}
        size="middle"
        summary={data => {
          if (!data.length) return null;
          
          // Calculer le total des prix
          const totalPrice = data.reduce((sum, item) => {
            const itemPrice = item.return_quantity && item.remain_quantity
              ? item.remain_quantity * item.product_sale_price
              : item.product_sale_price * item.product_quantity;
            return sum + itemPrice;
          }, 0);
          
          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row className="summary-row">
                <Table.Summary.Cell index={0} colSpan={columns.length - 1} align="right">
                  <Text strong>Total:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: '#52c41a' }}>
                    {totalPrice.toLocaleString('fr-FR')} €
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </Card>
  );
};

export default SaleProductListCard;