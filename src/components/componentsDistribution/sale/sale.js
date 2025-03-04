import React, { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Row, 
  Col, 
  message, 
  Spin, 
  InputNumber, 
  Select, 
  Card, 
  Typography, 
  Divider, 
  Space, 
  Tag,
  Badge,
  Tooltip
} from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined, UserOutlined, FilterOutlined, SaveOutlined } from '@ant-design/icons';
import PageTitle from "../../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import { addSale } from "../../../redux/reduxDistribution/actions/sale/addSaleAction";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const monthsPerPage = 5;
const currentDate = moment();

const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.list || []);
  const allCustomer = useSelector((state) => state.customers.list);
  
  const [loading, setLoading] = useState(false);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all");
  const [customer, setCustomer] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    calculateOrderSummary();
  }, [editedQuantities, products]);

  const loadInitialData = () => {
    setLoading(true);
    dispatch(loadProduct({ page: 1, limit: 100, status: "true" })).finally(() =>
      setLoading(false)
    );
  };

  const calculateOrderSummary = () => {
    let items = 0;
    let amount = 0;

    products.forEach(product => {
      const quantity = editedQuantities[product.id] || 0;
      if (quantity > 0) {
        items += quantity;
        amount += quantity * product.sale_price;
      }
    });

    setTotalItems(items);
    setTotalAmount(amount);
  };

  // Colonnes statiques issues des informations produit
  const getStandardColumns = () => [
    { 
      title: "Produit", 
      key: "product",
      render: (record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.name}</Text>
          <Space size="small">
            <Tag color="blue">{record.sku}</Tag>
            {record.marque && <Tag color="cyan">{record.marque}</Tag>}
          </Space>
        </Space>
      )
    },
    { 
      title: "Catégorie", 
      dataIndex: "product_category", 
      key: "product_category",
      render: (cat) => <Tag color="green">{cat && cat.name ? cat.name : cat}</Tag>,
      responsive: ['md']
    },
    { 
      title: "Stock", 
      key: "stock",
      align: "center",
      render: (record) => (
        <Space direction="vertical" size="small" align="center">
          <Badge 
            count={record.quantity} 
            showZero 
            color={record.quantity > 0 ? 'green' : 'red'} 
            overflowCount={9999}
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>Collisage: {record.collisage}</Text>
        </Space>
      )
    },
    { 
      title: "Prix", 
      dataIndex: "sale_price", 
      key: "sale_price",
      align: "right",
      render: (price) => (
        <Text strong>{price.toLocaleString('fr-FR')} €</Text>
      )
    },
  ];

  // Colonnes pour l'historique des 6 derniers mois
  const getMonthColumns = () => {
    const monthColumns = [];
    for (let i = 0; i < monthsPerPage; i++) {
      const monthMoment = currentDate.clone().subtract(monthsPerPage - 1 - i, "months");
      const monthTitle = monthMoment.format("MMM YYYY");
      const dataIndex = `month_${i}`;
      const isCurrentMonth = i === monthsPerPage - 1;
      
      monthColumns.push({
        title: isCurrentMonth ? <Text strong>{monthTitle}</Text> : monthTitle,
        dataIndex,
        key: dataIndex,
        align: "center",
        responsive: i < monthsPerPage - 2 ? ['lg'] : i < monthsPerPage - 1 ? ['md'] : [],
        render: (_, record) => {
          if (isCurrentMonth) {
            const storedValue = record[dataIndex] || 0;
            return (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {storedValue !== 0 && (
                  <Text type="secondary">{storedValue}</Text>
                )}
                <InputNumber
                  min={0}
                  defaultValue={0}
                  style={{ width: '80px' }}
                  onChange={(value) => {
                    setEditedQuantities((prev) => ({
                      ...prev,
                      [record.id]: value,
                    }));
                  }}
                  addonAfter={<Tooltip title="unités"><Text type="secondary">u</Text></Tooltip>}
                />
              </Space>
            );
          } else {
            return record[dataIndex] ? <Badge count={record[dataIndex]} showZero={false} overflowCount={9999} /> : "";
          }
        },
      });
    }
    return monthColumns;
  };

  const columns = [...getStandardColumns(), ...getMonthColumns()];

  // Filtrage des produits par catégorie
  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter((p) => {
          const catName = p.product_category && p.product_category.name ? p.product_category.name : p.product_category;
          return catName === currentCategory;
        });

  // Lors de la soumission, on récupère pour chaque produit la nouvelle commande (pour le mois en cours)
  const handleSaleSubmit = async () => {
    const salesData = filteredProducts
      .map((product) => {
        const additional = editedQuantities[product.id] || 0;
        if (additional > 0) {
          return {
            product_id: product.id,
            product_quantity: additional,
            product_sale_price: product.sale_price,
          };
        }
        return null;
      })
      .filter((sale) => sale !== null);

    if (!customer) {
      message.warning("Veuillez sélectionner un client");
      return;
    }
    if (salesData.length === 0) {
      message.warning("Aucune commande à enregistrer");
      return;
    }

    const currentUserId = parseInt(localStorage.getItem("id"));
    const valueData = {
      date: new Date().toString(),
      paid_amount: 0,
      discount: 0,
      customer_id: customer,
      user_id: currentUserId,
      saleInvoiceProduct: salesData,
    };

    try {
      setLoading(true);
      const resp = await dispatch(addSale(valueData));
      if (resp.message === "success") {
        message.success("Commandes enregistrées avec succès");
        setEditedQuantities({});
        loadInitialData();
        navigate(`/sale/${resp.createdInvoiceId}`);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      message.error("Erreur lors de l'enregistrement des commandes");
    }
  };

  // Obtenir les catégories uniques pour le filtre
  const uniqueCategories = [...new Set(
    products.map((p) =>
      p.product_category && p.product_category.name ? p.product_category.name : p.product_category
    )
  )].filter((cat) => cat);

  const selectedCustomer = allCustomer?.find(c => c.id === customer);

  return (
    <div className="sale-container">
      <Card bordered={false} className="header-card" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="link" 
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
            <Title level={4} style={{ marginBottom: 0 }}>Enregistrer une vente</Title>
          </Col>

          <Col xs={24} md={18}>
            <Row gutter={16} justify="end">
              <Col xs={24} sm={12} md={10} lg={8}>
                <Select
                  showSearch
                  placeholder="Sélectionner un client"
                  optionFilterProp="children"
                  onChange={setCustomer}
                  style={{ width: '100%' }}
                  loading={!allCustomer}
                  suffixIcon={<UserOutlined />}
                >
                  {allCustomer &&
                    allCustomer.map((cust) => (
                      <Option key={cust.id} value={cust.id}>
                        {cust.phone} - {cust.name}
                      </Option>
                    ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filtrer par catégorie"
                  value={currentCategory}
                  onChange={(value) => setCurrentCategory(value)}
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">Toutes catégories</Option>
                  {uniqueCategories.map((cat, idx) => (
                    <Option key={idx} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card bordered={false} className="table-card">
            <Spin spinning={loading}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredProducts}
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
            </Spin>
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card 
            title={<Space><ShoppingCartOutlined /> Résumé de la commande</Space>} 
            bordered={false} 
            className="summary-card"
          >
            {selectedCustomer ? (
              <div className="customer-info" style={{ marginBottom: 16 }}>
                <Text strong>Client:</Text> {selectedCustomer.name}
                <br />
                <Text type="secondary">{selectedCustomer.phone}</Text>
              </div>
            ) : (
              <div className="no-customer" style={{ marginBottom: 16 }}>
                <Text type="warning">Aucun client sélectionné</Text>
              </div>
            )}

            <Divider style={{ margin: '12px 0' }} />

            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Text>Produits différents:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{Object.keys(editedQuantities).filter(k => editedQuantities[k] > 0).length}</Text>
              </Col>
              
              <Col span={12}>
                <Text>Quantité totale:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{totalItems}</Text>
              </Col>
              
              <Col span={12}>
                <Text>Montant total:</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{totalAmount.toLocaleString('fr-FR')} €</Text>
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSaleSubmit}
              size="large"
              block
              disabled={!customer || totalItems === 0}
            >
              Enregistrer la commande
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Sale;