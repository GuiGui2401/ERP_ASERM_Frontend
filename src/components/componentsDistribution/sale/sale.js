import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, message, Spin, InputNumber, Select } from "antd";
import PageTitle from "../../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import { addSale } from "../../../redux/reduxDistribution/actions/sale/addSaleAction"; // import de l'action addSale
import moment from "moment";
import { useNavigate } from "react-router-dom";

const monthsPerPage = 6; // On affiche 6 mois, finissant par le mois en cours
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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setLoading(true);
    dispatch(loadProduct({ page: 1, limit: 100, status: "true" })).finally(() =>
      setLoading(false)
    );
  };

  // Colonnes statiques issues des informations produit
  const getStandardColumns = () => [
    { title: "Code Produit", dataIndex: "sku", key: "sku" },
    { title: "Nom du produit", dataIndex: "name", key: "name" },
    { title: "Marque", dataIndex: "marque", key: "marque" },
    {
      title: "Catégorie",
      dataIndex: "product_category",
      key: "product_category",
      render: (cat) => (cat && cat.name ? cat.name : cat),
    },
    { title: "Collisage", dataIndex: "collisage", key: "collisage" },
    { title: "Quantité disponible", dataIndex: "quantity", key: "quantity" },
    { title: "Prix de vente", dataIndex: "sale_price", key: "sale_price" },
    { title: "Gencode EAN", dataIndex: "gencode", key: "gencode" },
  ];

  // Colonnes pour les 6 mois finissant par le mois en cours
  const getMonthColumns = () => {
    const monthColumns = [];
    for (let i = 0; i < monthsPerPage; i++) {
      // Le premier mois affiché est le plus ancien et le dernier correspond au mois en cours
      const monthMoment = currentDate.clone().subtract(monthsPerPage - 1 - i, "months");
      const monthTitle = monthMoment.format("MMM YYYY");
      const dataIndex = `month_${i}`;
      const isCurrentMonth = i === monthsPerPage - 1;
      monthColumns.push({
        title: monthTitle,
        dataIndex,
        key: dataIndex,
        render: (_, record) => {
          if (isCurrentMonth) {
            // Pour le mois en cours : afficher la valeur enregistrée (si existante)
            // et toujours afficher en dessous un champ pour saisir une nouvelle commande
            const storedValue = record[dataIndex] || 0;
            return (
              <div>
                <div>{storedValue !== 0 ? storedValue : ""}</div>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  onChange={(value) => {
                    setEditedQuantities((prev) => ({
                      ...prev,
                      [record.id]: value,
                    }));
                  }}
                />
              </div>
            );
          } else {
            // Pour les autres mois : afficher la valeur enregistrée ou laisser vide
            return record[dataIndex] || "";
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
    // Ici, on met à 0 par défaut paid_amount et discount, car ces infos ne sont pas gérées sur cette page
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

  return (
    <div>
      <PageTitle title="Retour" subtitle="Enregistrer une vente" />
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Select
            showSearch
            placeholder="Sélectionner un client"
            optionFilterProp="children"
            onChange={setCustomer}
            style={{ width: 300 }}
            loading={!allCustomer}
          >
            {allCustomer &&
              allCustomer.map((cust) => (
                <Select.Option key={cust.id} value={cust.id}>
                  {cust.phone} - {cust.name}
                </Select.Option>
              ))}
          </Select>
        </Col>
        <Col>
          <Select
            style={{ width: 200 }}
            placeholder="Filtrer par catégorie"
            value={currentCategory}
            onChange={(value) => setCurrentCategory(value)}
          >
            <Select.Option value="all">Toutes</Select.Option>
            {[...new Set(
              products.map((p) =>
                p.product_category && p.product_category.name ? p.product_category.name : p.product_category
              )
            )]
              .filter((cat) => cat)
              .map((cat, idx) => (
                <Select.Option key={idx} value={cat}>
                  {cat}
                </Select.Option>
              ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={handleSaleSubmit}>
            Enregistrer la commande
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredProducts}
          pagination={{ pageSize: 50 }}
        />
      </Spin>
    </div>
  );
};

export default Sale;
