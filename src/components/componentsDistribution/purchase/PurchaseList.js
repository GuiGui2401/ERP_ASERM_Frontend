import React from "react";
import { 
  List, 
  Card, 
  Space, 
  Avatar, 
  Typography, 
  Tag, 
  Divider, 
  Tooltip,
  Badge
} from "antd";
import { 
  ShoppingOutlined, 
  DollarOutlined, 
  InboxOutlined, 
  TeamOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./purchase-list.css";

const { Text, Title } = Typography;

const PurchaseList = ({ data }) => {
  // Calculer le total de tous les produits
  const calculateTotal = () => {
    if (!data || !Array.isArray(data)) return 0;
    
    return data.reduce((total, item) => {
      const itemTotal = item.product_quantity * item.product_purchase_price;
      return total + itemTotal;
    }, 0);
  };

  const totalAmount = calculateTotal();
  
  return (
    <Card 
      className="purchase-list-card"
      title={
        <Space>
          <ShoppingOutlined style={{ color: '#1890ff' }} />
          <span>Liste des produits facturés</span>
        </Space>
      }
      extra={
        <Space>
          <Text type="secondary">Total:</Text>
          <Text strong>{totalAmount.toLocaleString('fr-FR')} €</Text>
        </Space>
      }
    >
      <List
        className="purchase-list"
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => {
          // Calculer le total pour cet article
          const itemTotal = item.product_quantity * item.product_purchase_price;
          
          return (
            <List.Item
              key={item.id}
              className="purchase-list-item"
              actions={[
                <Tag color="blue" className="item-total">
                  {itemTotal.toLocaleString('fr-FR')} €
                </Tag>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={index + 1} color="#1890ff">
                    <Avatar 
                      size="large" 
                      shape="square"
                      icon={<InboxOutlined />} 
                      className="product-avatar"
                      style={{ 
                        backgroundColor: '#e6f7ff',
                        color: '#1890ff'
                      }}
                    />
                  </Badge>
                }
                title={
                  <Link to={`/product/${item.product.id}`} className="product-link">
                    {item.product.name}
                  </Link>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Space wrap>
                      <Space>
                        <DollarOutlined />
                        <Text>Prix unitaire:</Text>
                        <Text strong>{item.product_purchase_price.toLocaleString('fr-FR')} €</Text>
                      </Space>

                      <Divider type="vertical" />

                      <Space>
                        <InboxOutlined />
                        <Text>Quantité:</Text>
                        <Text strong>{item.product_quantity}</Text>
                      </Space>
                    </Space>
                    
                    {item.product.sku && (
                      <Text type="secondary">SKU: {item.product.sku}</Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          );
        }}
        footer={
          <div className="purchase-list-footer">
            <Space className="purchase-summary" align="baseline">
              <TeamOutlined />
              <Text type="secondary">
                {data.length} {data.length > 1 ? 'produits' : 'produit'} dans cette facture
              </Text>
            </Space>
            
            <Space>
              <Text>Montant total:</Text>
              <Text strong style={{ fontSize: '16px' }}>
                {totalAmount.toLocaleString('fr-FR')} €
              </Text>
            </Space>
          </div>
        }
      />
    </Card>
  );
};

export default PurchaseList;