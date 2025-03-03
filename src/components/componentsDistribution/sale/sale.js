import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, message, Spin, InputNumber, Select, AutoComplete, Input } from "antd";
import PageTitle from "../../page-header/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import moment from "moment";

const monthsPerPage = 6; // On affiche 6 mois, finissant par le mois en cours
const currentDate = moment();

const Sale = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list || []);

  const [loading, setLoading] = useState(false);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all");
  const [client, setClient] = useState("");
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setLoading(true);
    dispatch(loadProduct({ page: 1, limit: 100, status: "true" })).finally(() =>
      setLoading(false)
    );
  };

  // Recherche de client via AutoComplete
  const handleClientSearch = (value) => {
    setClient(value);
    fetch(`/api/clients?query=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((suggestions) => {
        const options = suggestions.map((cl) => ({
          value: cl.name,
        }));
        setClientOptions(options);
      })
      .catch((err) => console.error("Erreur lors du chargement des clients:", err));
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
      // Calculer le mois à afficher : le premier affiché est le plus ancien, le dernier correspond au mois en cours
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
            // et en dessous, un champ pour saisir une nouvelle commande (celle-ci sera ajoutée à la valeur déjà en BD)
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
            // Pour les autres mois : afficher la valeur enregistrée (ou laisser vide)
            return record[dataIndex] || "";
          }
        },
      });
    }
    return monthColumns;
  };

  const columns = [...getStandardColumns(), ...getMonthColumns()];

  // Filtrage des produits par catégorie (en utilisant product_category)
  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter((p) => {
          const catName =
            p.product_category && p.product_category.name
              ? p.product_category.name
              : p.product_category;
          return catName === currentCategory;
        });

  // Lors de la soumission, on récupère uniquement pour le mois en cours
  // la nouvelle commande (le champ InputNumber) pour chaque produit
  const handleSaleSubmit = () => {
    const salesData = filteredProducts
      .map((product) => {
        const additional = editedQuantities[product.id] || 0;
        if (additional > 0) {
          return {
            productId: product.id,
            additionalQuantity: additional,
          };
        }
        return null;
      })
      .filter((sale) => sale !== null);

    if (!client) {
      message.warning("Veuillez sélectionner un client");
      return;
    }

    if (salesData.length === 0) {
      message.warning("Aucune commande à enregistrer");
      return;
    }

    const payload = {
      client,
      sales: salesData,
    };

    fetch("/api/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        message.success("Commandes enregistrées avec succès");
        setEditedQuantities({});
        loadInitialData();
      })
      .catch((err) => {
        message.error("Erreur lors de l'enregistrement des commandes");
        console.error(err);
      });
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle="Enregistrer une vente" />
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <AutoComplete
            style={{ width: 300 }}
            options={clientOptions}
            onSearch={handleClientSearch}
            placeholder="Rechercher un client"
            value={client}
            onChange={setClient}
          >
            <Input />
          </AutoComplete>
        </Col>
        <Col>
          <Select
            style={{ width: 200 }}
            placeholder="Filtrer par catégorie"
            value={currentCategory}
            onChange={(value) => setCurrentCategory(value)}
          >
            <Select.Option value="all">Toutes</Select.Option>
            {
              // Extraction dynamique des catégories
              [...new Set(products.map((p) => (p.product_category && p.product_category.name ? p.product_category.name : p.product_category)))]
                .filter((cat) => cat)
                .map((cat, idx) => (
                  <Select.Option key={idx} value={cat}>
                    {cat}
                  </Select.Option>
                ))
            }
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
