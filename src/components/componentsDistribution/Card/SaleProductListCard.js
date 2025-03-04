import React from "react";
import { 
  Card, 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Badge, 
  Tooltip,
  Divider
} from "antd";
import { 
  ShoppingOutlined, 
  FileTextOutlined, 
  DollarOutlined, 
  NumberOutlined,
  TagOutlined,
  CalculatorOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./sale-product-list-card.css";

const { Text, Title } = Typography;

const SaleProductListCard = ({ list }) => {
  // Formatage des montants pour l'affichage
  const formatAmount = (amount) => {
    return amount ? amount.toLocaleString('fr-FR') : '0';
  };

  // Calcul du montant total
  const calculateTotal = () => {
    if (!list || !Array.isArray(list)) return 0;
    
    return list.reduce((total, item) => {
      const itemTotal = item.product_quantity * item.product_purchase_price;
      return total + itemTotal;
    }, 0);
  };

  const totalAmount = calculateTotal();

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
      width: 80,
      render: (id) => <Tag color="blue">#{id}</Tag>,
      sorter: (a, b) => a.id - b.id,
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
      sorter: (a, b) => a.product.name.localeCompare(b.product.name),
      render: (product) => (
        <Link to={`/product/${product.id}`} className="product-link">
          <Text ellipsis={{ tooltip: product.name }}>{product.name}</Text>
          {product.sku && (
            <div className="product-sku">
              <Text type="secondary">SKU: {product.sku}</Text>
            </div>
          )}
        </Link>
      ),
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
      width: 120,
      align: "center",
      sorter: (a, b) => a.product_quantity - b.product_quantity,
      render: (qty) => (
        <Badge 
          count={qty} 
          showZero 
          overflowCount={9999}
          style={{ backgroundColor: '#52c41a' }}
          className="quantity-badge"
        />
      )
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          Prix d'achat
        </Space>
      ),
      dataIndex: "product_purchase_price",
      key: "product_purchase_price",
      width: 130,
      align: "right",
      sorter: (a, b) => a.product_purchase_price - b.product_purchase_price,
      render: (price) => (
        <Text>{formatAmount(price)} €</Text>
      )
    },
    {
      title: (
        <Space>
          <CalculatorOutlined />
          Prix Total
        </Space>
      ),
      key: "Total Price",
      dataIndex: "",
      width: 130,
      align: "right",
      render: ({ product_quantity, product_purchase_price }) => (
        <Text strong>
          {formatAmount(product_purchase_price * product_quantity)} €
        </Text>
      ),
      sorter: (a, b) =>
        a.product_quantity * a.product_purchase_price -
        b.product_quantity * b.product_purchase_price,
    },
  ];

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id || i.product_id }));

  return (
    <Card 
      className="product-list-card"
      title={
        <Space>
          <ShoppingOutlined className="card-icon" />
          <span>Informations sur les produits vendus</span>
        </Space>
      }
      extra={
        <Tooltip title="Total de tous les produits">
          <Tag color="green" className="total-tag">
            Total: {formatAmount(totalAmount)} €
          </Tag>
        </Tooltip>
      }
    >
      <Table
        className="product-table"
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
        summary={pageData => {
          if (!pageData.length) return null;
          
          // Calculer le total des produits visibles sur cette page
          const pageTotal = pageData.reduce((sum, row) => {
            return sum + (row.product_quantity * row.product_purchase_price);
          }, 0);
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="summary-row">
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  <Text strong>Total de la page:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ color: '#52c41a' }}>
                    {formatAmount(pageTotal)} €
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