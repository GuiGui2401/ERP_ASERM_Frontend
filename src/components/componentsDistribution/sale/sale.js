import PageTitle from "../../page-header/PageHeader";
import { Table, Button, Row, Col, message, Spin, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct } from "../../../redux/reduxDistribution/actions/product/getAllProductAction";
import moment from "moment";

const Sale = () => {
  const dispatch = useDispatch();

  // Redux states
  const products = useSelector((state) => state.products.list || []);

  // Local states
  const [loading, setLoading] = useState(false);
  const [currentRangeIndex, setCurrentRangeIndex] = useState(0);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [currentCategory, setCurrentCategory] = useState("BDC"); // Catégorie par défaut

  // Pagination and months
  const monthsPerPage = currentCategory === "BDC" ? 10 : 6;
  const startMonth = moment("2024-06-01");
  const currentDate = moment();
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

  const getColumnsByCategory = () => {
    switch (currentCategory) {
      case "OGX":
        return [
          { title: "Brand", dataIndex: "marque", key: "marque" },
          { title: "Euro Code", dataIndex: "sku", key: "sku" },
          { title: "Designation", dataIndex: "name", key: "name" },
          { title: "Size", dataIndex: "size", key: "size" },
          { title: "Warehouse", dataIndex: "warehouse", key: "warehouse" },
          { title: "EAN", dataIndex: "gencode", key: "gencode" },
          {
            title: "GTS Price EUR",
            dataIndex: "sale_price",
            key: "sale_price",
            render: (price) => (price / exchangeRate).toFixed(2),
          },
          { title: "Case Size", dataIndex: "quantity", key: "quantity" },
          { title: "Layer Size", dataIndex: "qty_layer", key: "qty_layer" },
          { title: "Pallet Size", dataIndex: "cartons", key: "cartons" },
        ];
      case "Neutrogena":
        return [
          { title: "EAN", dataIndex: "gencode", key: "gencode" },
          { title: "DESCRIPTION", dataIndex: "name", key: "name" },
          { title: "QTY", dataIndex: "quantity", key: "quantity" },
          { title: "UNIT", key: "unit", render: () => "pcs" },
          { title: "Prix Consommateur", dataIndex: "consumer_price", key: "consumer_price" },
          {
            title: "Prix Grossiste TTC",
            dataIndex: "sale_price",
            key: "sale_price",
          },
        ];
      case "Loreal":
        return [
          { title: "EAN", dataIndex: "gencode", key: "gencode" },
          { title: "SIGNATURE", dataIndex: "marque", key: "marque" },
          { title: "DESCRIPTION", dataIndex: "name", key: "name" },
          { title: "Segment", dataIndex: "family", key: "family" },
          { title: "Status", dataIndex: "unit_type", key: "unit_type" },
          {
            title: "EXWORKS EUR",
            dataIndex: "sale_price",
            key: "sale_price",
            render: (price) => (price / exchangeRate).toFixed(2),
          },
        ];
      default:
        return [
          { title: "Marque", dataIndex: "marque", key: "marque" },
          { title: "Ligne", dataIndex: "line", key: "line" },
          { title: "Axe", dataIndex: "unit_type", key: "unit_type" },
          {
            title: "Famille",
            dataIndex: "family",
            key: "family",
            render: (_, record) => record.product_category?.name || "",
          },
          { title: "Gencod (Code barre)", dataIndex: "gencode", key: "gencode" },
          { title: "Qty palet", dataIndex: "quantity", key: "quantity" },
          { title: "Qty layer", dataIndex: "qty_layer", key: "qty_layer" },
          { title: "Cart. (Cartons)", dataIndex: "cartons", key: "cartons" },
          { title: "Ss cart. (Sous-cartons)", dataIndex: "ss_cart", key: "ss_cart" },
          { title: "Code SAP", dataIndex: "sku", key: "sku" },
          { title: "Article", dataIndex: "name", key: "name" },
          { title: "Tarif", dataIndex: "sale_price", key: "sale_price" },
        ];
    }
  };

  const columns = [...getColumnsByCategory(), ...getMonthColumns()];

  const handleSavePurchases = () => {
    const selectedProducts = Object.entries(editedQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

    if (selectedProducts.length === 0) {
      message.warning("Aucun produit sélectionné.");
      return;
    }

    console.log("Produits sauvegardés :", selectedProducts);
    message.success("Achats sauvegardés avec succès !");
  };

  return (
    <div>
      <PageTitle title="Retour" subtitle="PHARMACIE" />
	  <br/>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Select
            value={currentCategory}
            onChange={(value) => setCurrentCategory(value)}
            style={{ width: 200, marginBottom: 16 }}
          >
            <Select.Option value="BDC">Fiche BDC</Select.Option>
            <Select.Option value="OGX">Fiche OGX & Listerine</Select.Option>
            <Select.Option value="Neutrogena">Fiche Neutrogena Listerine</Select.Option>
            <Select.Option value="Loreal">Fiche L'Oréal ACD</Select.Option>
          </Select>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={products}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1500 }}
            />
          </Spin>
          <div style={{ marginTop: 16 }}>
            <Button
              onClick={() => setCurrentRangeIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentRangeIndex === 0}
              style={{ marginRight: 8 }}
            >
              Plage précédente
            </Button>
            <Button
              onClick={() => setCurrentRangeIndex((prev) => Math.min(prev + 1, totalRanges() - 1))}
              disabled={currentRangeIndex >= totalRanges() - 1}
            >
              Plage suivante
            </Button>
            <Button
              type="primary"
              onClick={handleSavePurchases}
              style={{ marginLeft: 16 }}
            >
              Sauvegarder les achats
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Sale;
