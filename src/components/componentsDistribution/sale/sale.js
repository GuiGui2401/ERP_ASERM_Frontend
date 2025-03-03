import PageTitle from "../../page-header/PageHeader";
import { Table, Button, Row, Col, message, Spin, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import moment from "moment";
import React from "react";

const monthsPerPage = 3; // par exemple
const startMonth = moment("2023-01-01"); // à adapter à ta config
const currentDate = moment();

const Sale = () => {
  const dispatch = useDispatch();

  // Redux states
  const products = useSelector((state) => state.products.list || []);

  // Local states
  const [loading, setLoading] = useState(false);
  const [currentRangeIndex, setCurrentRangeIndex] = useState(0);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all"); // Catégorie par défaut

  // Pagination and months
  const exchangeRate = 655.957; // Taux FCFA -> EUR

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setLoading(true);
    dispatch(loadProduct({ page: 1, limit: 100, status: "true" })).finally(() =>
      setLoading(false)
    );
  };

  const totalRanges = () => {
    const monthsDiff = moment().diff(startMonth, "months");
    const maxRangeIndex = Math.ceil((monthsDiff + monthsPerPage) / monthsPerPage);
    return maxRangeIndex;
  };

  // Colonnes dynamiques pour afficher les mois (pour la quantité à vendre)
  const getMonthColumns = () => {
    const rangeStartMonth = startMonth.clone().add(currentRangeIndex * monthsPerPage, "months");
    const monthColumns = [];

    for (let i = 0; i < monthsPerPage; i++) {
      const month = rangeStartMonth.clone().add(i, "months").format("MMM YYYY");
      const isCurrentMonth = currentDate.isSame(rangeStartMonth.clone().add(i, "months"), "month");

      monthColumns.push({
        title: month,
        dataIndex: `month_${currentRangeIndex * monthsPerPage + i}`,
        key: `month_${currentRangeIndex * monthsPerPage + i}`,
        render: (_, record) =>
          isCurrentMonth ? (
            <InputNumber
              min={0}
              defaultValue={editedQuantities[record.id] || 0}
              onChange={(value) => {
                setEditedQuantities((prev) => ({
                  ...prev,
                  [record.id]: value,
                }));
              }}
            />
          ) : (
            ""
          ),
      });
    }

    return monthColumns;
  };

  // Colonnes standards basées sur ta structure produit
  const getStandardColumns = () => [
    { title: "Code Produit", dataIndex: "codeProduit", key: "codeProduit" },
    { title: "Nom du produit", dataIndex: "name", key: "name" },
    { title: "Marque", dataIndex: "marque", key: "marque" },
    { title: "Catégorie", dataIndex: "categorie", key: "categorie" },
    { title: "Collisage", dataIndex: "collisage", key: "collisage" },
    { title: "Quantité disponible", dataIndex: "quantity", key: "quantity" },
    { title: "Prix de vente", dataIndex: "sale_price", key: "sale_price" },
    { title: "Gencode EAN", dataIndex: "gencode", key: "gencode" },
    { title: "6 mois", dataIndex: "sixMois", key: "sixMois" },
  ];

  const columns = [...getStandardColumns(), ...getMonthColumns()];

  // Filtrage des produits par catégorie si besoin
  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter((p) => p.categorie === currentCategory);

  // Envoie des ventes pour chaque produit avec quantité saisie
  const handleSaleSubmit = () => {
    const salesData = filteredProducts
      .map((product) => ({
        productId: product.id,
        quantitySold: editedQuantities[product.id] || 0,
      }))
      .filter((sale) => sale.quantitySold > 0);

    if (salesData.length === 0) {
      message.warning("Aucune vente à enregistrer");
      return;
    }

    fetch("/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(salesData),
    })
      .then((res) => res.json())
      .then((data) => {
        message.success("Ventes enregistrées avec succès");
        setEditedQuantities({});
        loadInitialData(); // recharge les produits si nécessaire
      })
      .catch((err) => {
        message.error("Erreur lors de l'enregistrement des ventes");
        console.error(err);
      });
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle="PHARMACIE" />
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Select
            style={{ width: 200 }}
            placeholder="Filtrer par catégorie"
            value={currentCategory}
            onChange={(value) => setCurrentCategory(value)}
          >
            <Select.Option value="all">Toutes</Select.Option>
            {
              // On récupère toutes les catégories présentes dans les produits
              [...new Set(products.map((p) => p.categorie))].map((cat, idx) => (
                <Select.Option key={idx} value={cat}>
                  {cat}
                </Select.Option>
              ))
            }
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={handleSaleSubmit}>
            Enregistrer la vente
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