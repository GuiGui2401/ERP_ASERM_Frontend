import { 
  DeleteOutlined, 
  PlusOutlined, 
  ShoppingOutlined, 
  CalculatorOutlined, 
  NumberOutlined,
  DollarOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import { 
  Button, 
  Col, 
  Form, 
  InputNumber, 
  Row, 
  Select, 
  Card, 
  Space, 
  Typography, 
  Divider, 
  Empty,
  Tag,
  Tooltip
} from "antd";
import "./product.css";

const { Text, Title } = Typography;
const { Option } = Select;

const getItemTotal = (item) => {
  if (!item || typeof item !== "object") return 0;
  var totalPrice = item.product_quantity * item.product_purchase_price;
  if (isNaN(totalPrice)) totalPrice = 0;
  return totalPrice;
};

export default function Products({
  allProducts,
  formData,
  updateFormData,
  selectedProds,
  handleSelectedProdsQty,
  handleDeleteProd,
  handleSelectedProds,
  handleSelectedProdsPurchasePrice,
}) {
  // Calculer le montant total de tous les produits sélectionnés
  const calculateTotal = () => {
    if (!selectedProds || !Array.isArray(selectedProds)) return 0;
    
    return selectedProds.reduce((total, prod) => {
      if (prod && prod.selectedQty && prod.purchase_price) {
        return total + (prod.selectedQty * prod.purchase_price);
      }
      return total;
    }, 0);
  };

  const totalAmount = calculateTotal();

  return (
    <Card 
      className="products-card"
      title={
        <Space>
          <ShoppingOutlined />
          <span>Sélection des produits</span>
        </Space>
      }
      extra={
        <Text>
          Total: <Text strong>{totalAmount.toLocaleString('fr-FR')} €</Text>
        </Text>
      }
    >
      <Row 
        gutter={[16, 0]} 
        className="products-header"
        align="middle"
      >
        <Col span={2}>
          <Text strong>#</Text>
        </Col>
        <Col span={6}>
          <Text strong>Produit</Text>
        </Col>
        <Col span={5}>
          <Text strong>Quantité</Text>
        </Col>
        <Col span={5}>
          <Text strong>Prix Unitaire</Text>
        </Col>
        <Col span={3}>
          <Text strong>Total</Text>
        </Col>
        <Col span={3}>
          <Text strong>Action</Text>
        </Col>
      </Row>

      <Divider style={{ margin: '12px 0' }} />

      <Form.List name="purchaseInvoiceProduct">
        {(fields, { add, remove }) => (
          <div className="product-list-container">
            {fields.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="Aucun produit sélectionné" 
                className="empty-products"
              />
            ) : (
              fields.map(({ key, name, ...restField }, index) => (
                <Row 
                  className="product-row" 
                  gutter={[16, 0]} 
                  key={key}
                  align="middle"
                >
                  <Col span={2}>
                    <div className="index-badge">
                      {index + 1}
                    </div>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      {...restField} 
                      name={[name, "product_id"]}
                      rules={[{ required: true, message: 'Sélectionnez un produit' }]}
                    >
                      <Select
                        placeholder="Sélectionner un produit"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(prodId) => handleSelectedProds(prodId, key)}
                        className="product-select"
                        dropdownClassName="product-dropdown"
                      >
                        {Array.isArray(allProducts) &&
                          allProducts.map((p) => (
                            <Option key={p.id} value={p.id}>
                              {p.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item 
                      {...restField} 
                      name={[name, "product_quantity"]}
                      rules={[{ required: true, message: 'Quantité requise' }]}
                    >
                      <InputNumber
                        className="quantity-input"
                        placeholder="Quantité"
                        onChange={(qty) => handleSelectedProdsQty(key, qty)}
                        value={
                          selectedProds[key] ? selectedProds[key].selectedQty : ""
                        }
                        min={1}
                        addonBefore={<NumberOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, "product_purchase_price"]}
                      rules={[{ required: true, message: 'Prix requis' }]}
                    >
                      <InputNumber
                        className="price-input"
                        placeholder="Prix d'achat"
                        onChange={(purchasePrice) =>
                          handleSelectedProdsPurchasePrice(key, purchasePrice)
                        }
                        value={
                          selectedProds[key]
                            ? selectedProds[key].purchase_price
                            : ""
                        }
                        min={0}
                        addonBefore={<DollarOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <div className="product-total">
                      {selectedProds[key] &&
                      selectedProds[key].selectedQty &&
                      selectedProds[key].purchase_price ? (
                        <Tag color="blue">
                          {(selectedProds[key].selectedQty * selectedProds[key].purchase_price).toLocaleString('fr-FR')} €
                        </Tag>
                      ) : (
                        <Text type="secondary">-</Text>
                      )}
                    </div>
                  </Col>
                  <Col span={3}>
                    <Tooltip title="Supprimer ce produit">
                      <Button
                        className="delete-button"
                        shape="circle"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          remove(name);
                          handleDeleteProd(key);
                        }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              ))
            )}
            
            <Form.Item className="add-product-button">
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="add-button"
              >
                Ajouter un produit
              </Button>
            </Form.Item>

            {fields.length > 0 && (
              <div className="products-summary">
                <Divider style={{ margin: '16px 0' }} />
                <Row justify="end">
                  <Col span={12} md={8} lg={6}>
                    <Row>
                      <Col span={12}><Text strong>Nombre de produits:</Text></Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <Text>{fields.length}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}><Text strong>Montant total:</Text></Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                          {totalAmount.toLocaleString('fr-FR')} €
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Form.List>
    </Card>
  );
}