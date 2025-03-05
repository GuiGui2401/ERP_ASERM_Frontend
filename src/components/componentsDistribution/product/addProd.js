import { PlusOutlined, BarcodeOutlined, UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  Divider,
  Space,
  InputNumber,
  Alert,
  Tooltip,
  Tabs,
  Spin,
  message
} from "antd";
import { toast } from "react-toastify";

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../redux/reduxDistribution/actions/product/addProductAction";
import { loadAllProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/getProductCategoryAction";
import { loadSuppliers } from "../../../redux/reduxDistribution/actions/supplier/getSuppliersAction";
import UploadMany from "../Card/UploadMany";
import styles from "./AddProd.module.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AddProd = () => {
  const unitType = ["CTN", "AAC", "Nuit", "Fun", "Moda", "Hair", "Miscellaneous"];
  
  // Redux state
  const category = useSelector((state) => state.productCategories?.list);
  const allSuppliers = useSelector((state) => state.suppliers.list);
  const dispatch = useDispatch();
  
  // Form states
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sku, setSku] = useState("");
  const [depense, setDepense] = useState(0);
  const [margeCFA, setMargeCFA] = useState(0);
  const [margeEUR, setMargeEUR] = useState(0);
  const [purchasePriceCFA, setPurchasePriceCFA] = useState(0);
  const [purchasePriceEUR, setPurchasePriceEUR] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [productSaved, setProductSaved] = useState(false);

  // Constants
  const EURO_TO_CFA_RATE = 655.957; // Taux de conversion fixe

  //useEffect for loading category list from redux
  useEffect(() => {
    dispatch(loadAllProductCategory({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSuppliers({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Calculate sale price when dependencies change
  useEffect(() => {
    const calculatedSalePrice = Number(margeCFA) + Number(purchasePriceCFA) + Number(depense);
    setSalePrice(calculatedSalePrice);
    form.setFieldsValue({ sale_price: calculatedSalePrice });
  }, [margeCFA, purchasePriceCFA, depense, form]);

  // Handlers for currency conversion
  const handlePurchasePriceCFAChange = (value) => {
    setPurchasePriceCFA(value);
    setPurchasePriceEUR((value / EURO_TO_CFA_RATE).toFixed(2));
  };

  const handlePurchasePriceEURChange = (value) => {
    setPurchasePriceEUR(value);
    setPurchasePriceCFA((value * EURO_TO_CFA_RATE).toFixed(2));
  };

  const handleMargeCFAChange = (value) => {
    setMargeCFA(value);
    setMargeEUR((value / EURO_TO_CFA_RATE).toFixed(2));
  };

  const handleMargeEURChange = (value) => {
    setMargeEUR(value);
    setMargeCFA((value * EURO_TO_CFA_RATE).toFixed(2));
  };

  const handleDepenseChange = (value) => {
    setDepense(Number(value));
  };

  // Generate SKU
  const handleGenerateSku = () => {
    const generatedSku = Math.floor(Math.random() * 900000000) + 100000000;
    const productName = form.getFieldValue("name");
    if (productName) {
      const productNameAbbrev = productName.slice(0, 3).toUpperCase();
      setSku(`ASERM-${productNameAbbrev}${generatedSku.toString()}`);
    } else {
      toast.warn("Veuillez saisir un nom de produit avant de générer le SKU!");
    }
  };

  // File upload handlers
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Before upload validation
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez télécharger que des fichiers image!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('L\'image doit être inférieure à 2 Mo!');
    }
    return false;
  };

  // Form submission
  const onFinish = async (values) => {
    try {
      setLoader(true);
      
      let formData = new FormData();
      
      // Add file if uploaded
      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      } else {
        toast.error("Veuillez télécharger une image du produit");
        setLoader(false);
        return;
      }
      
      // Append form values
      formData.append("name", values.name);
      formData.append("quantity", values.quantity);
      formData.append("purchase_price", purchasePriceCFA);
      formData.append("sale_price", values.sale_price);
      formData.append("product_category_id", values.product_category_id);
      formData.append("idSupplier", values.idSupplier);
      formData.append("sku", sku || values.sku);
      formData.append("unit_type", values.unit_type);
      formData.append("reorder_quantity", values.reorder_quantity);
      formData.append("unit_measurement", values.unit_measurement);
      formData.append("collisage", values.collisage);
      formData.append("marge", margeCFA);
      formData.append("gencode", values.gencode);
      formData.append("marque", values.marque);
      formData.append("depense", values.depense);
      formData.append("warehouse", values.warehouse);

      const resp = await dispatch(addProduct(formData));

      if (resp.message === "success") {
        toast.success("Produit ajouté avec succès");
        setProductSaved(true);
        
        // Reset all form fields
        form.resetFields();
        setFileList([]);
        setSku("");
        setPurchasePriceCFA(0);
        setPurchasePriceEUR(0);
        setMargeCFA(0);
        setMargeEUR(0);
        setDepense(0);
        setSalePrice(0);
        
        // Hide success notification after 5 seconds
        setTimeout(() => {
          setProductSaved(false);
        }, 5000);
      } else {
        toast.error("Erreur lors de l'ajout du produit");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Erreur lors de la création du produit");
    } finally {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    toast.error("Veuillez remplir tous les champs obligatoires");
    console.log("Failed:", errorInfo);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setSku("");
    setPurchasePriceCFA(0);
    setPurchasePriceEUR(0);
    setMargeCFA(0);
    setMargeEUR(0);
    setDepense(0);
    setSalePrice(0);
  };

  return (
    <Fragment>
      <Card
        className="shadow-sm mb-4"
        bordered={false}
        title={
          <Title level={4} className="mb-0 text-center">
            Gestion des produits
          </Title>
        }
        extra={
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            type="card"
            size="small"
            style={{ marginBottom: 0 }}
          >
            <TabPane tab="Ajouter un produit" key="1" />
            <TabPane tab="Importer (CSV)" key="2" />
          </Tabs>
        }
      >
        {productSaved && (
          <Alert
            message="Produit enregistré avec succès"
            description="Le produit a été ajouté à votre inventaire."
            type="success"
            showIcon
            closable
            className="mb-4 mx-auto"
            style={{ maxWidth: '800px' }}
          />
        )}

        {activeTab === "1" ? (
          <Row justify="center" className="mt-3">
            <Col xs={24} sm={24} md={20} lg={18} xl={16}>
              <Card 
                className="shadow-sm" 
                bordered={false}
                title={
                  <Title level={5} className="mb-0">
                    Informations du produit
                  </Title>
                }
              >
                <Form
                  form={form}
                  name="product_form"
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  initialValues={{
                    warehouse: "WH1",
                    depense: 0,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Image du produit"
                        name="image"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez télécharger une image",
                          },
                        ]}
                      >
                        <Upload
                          listType="picture-card"
                          beforeUpload={beforeUpload}
                          fileList={fileList}
                          maxCount={1}
                          onChange={handleFileChange}
                          accept="image/*"
                        >
                          {fileList.length < 1 ? (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Télécharger</div>
                            </div>
                          ) : null}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Nom du produit"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le nom du produit!",
                          },
                        ]}
                      >
                        <Input placeholder="Nom du produit" />
                      </Form.Item>

                      <Form.Item
                        label="Segment"
                        name="marque"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le segment du produit!",
                          },
                        ]}
                      >
                        <Input placeholder="Segment du produit" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">Catégorisation</Divider>

                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="idSupplier"
                        label="Fournisseur"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner le fournisseur!",
                          },
                        ]}
                      >
                        <Select
                          loading={!allSuppliers}
                          showSearch
                          placeholder="Sélectionner un fournisseur"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {allSuppliers &&
                            allSuppliers.map((sup) => (
                              <Select.Option key={sup.id} value={sup.id}>
                                {sup.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="product_category_id"
                        label="Catégorie"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner la catégorie!",
                          },
                        ]}
                      >
                        <Select
                          loading={!category}
                          showSearch
                          placeholder="Sélectionner une catégorie"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.includes(input)
                          }
                        >
                          {category &&
                            category.map((cate) => (
                              <Select.Option key={cate.id} value={cate.id}>
                                {cate.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="unit_type"
                        label="Gamme"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner la gamme!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Sélectionner la gamme"
                          optionFilterProp="children"
                        >
                          {unitType.map((unit) => (
                            <Select.Option key={unit} value={unit}>
                              {unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Entrepôt (Warehouse)"
                        name="warehouse"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez sélectionner l'entrepôt!",
                          },
                        ]}
                      >
                        <Select placeholder="Sélectionner un entrepôt">
                          <Select.Option value="WH1">Italy</Select.Option>
                          <Select.Option value="WH2">À confirmer</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Code Produit (SKU)"
                        name="sku"
                      >
                        <Input
                          value={sku}
                          readOnly
                          placeholder="Générer automatiquement ou saisir manuellement"
                          suffix={
                            <Tooltip title="Générer un code produit unique">
                              <Button
                                type="primary"
                                size="small"
                                icon={<BarcodeOutlined />}
                                onClick={handleGenerateSku}
                              />
                            </Tooltip>
                          }
                        />
                        {sku && (
                          <Text type="secondary" className="mt-1 d-block">
                            Code généré: {sku}
                          </Text>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Code-barres (EAN)"
                        name="gencode"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le code-barres!",
                          },
                        ]}
                      >
                        <Input placeholder="Code-barres EAN" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Collisage"
                        name="collisage"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir le collisage!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="Nombre d'unités par colis"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">Quantités & Mesures</Divider>

                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Unité de mesure"
                        name="unit_measurement"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir l'unité!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          placeholder="Unité de mesure"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Quantité commandée"
                        name="reorder_quantity"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la quantité commandée!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          placeholder="Quantité commandée"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Quantité reçue"
                        name="quantity"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir la quantité reçue!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          placeholder="Quantité reçue"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">Prix & Marges</Divider>

                  <Row gutter={16}>
                    <Col xs={24} lg={6}>
                      <Form.Item
                        label="Prix d'achat (FCFA)"
                        name="purchase_price_cfa"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="En FCFA"
                          min={0}
                          step={100}
                          value={purchasePriceCFA}
                          onChange={handlePurchasePriceCFAChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Form.Item
                        label="Prix d'achat (€)"
                        name="purchase_price_eur"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="En Euros"
                          min={0}
                          step={0.1}
                          precision={2}
                          value={purchasePriceEUR}
                          onChange={handlePurchasePriceEURChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Form.Item
                        label="Dépenses additionnelles"
                        name="depense"
                        rules={[
                          {
                            required: true,
                            message: "Veuillez saisir les dépenses!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          placeholder="Frais additionnels"
                          onChange={handleDepenseChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <Form.Item
                        label="Prix de vente (FCFA)"
                        name="sale_price"
                        tooltip="Calculé automatiquement: Prix d'achat + Dépenses + Marge"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          value={salePrice}
                          readOnly
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Marge (FCFA)"
                        name="marge_cfa"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Marge en FCFA"
                          min={0}
                          step={100}
                          value={margeCFA}
                          onChange={handleMargeCFAChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Marge (€)"
                        name="marge_eur"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Marge en Euros"
                          min={0}
                          step={0.1}
                          precision={2}
                          value={margeEUR}
                          onChange={handleMargeEURChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Alert
                    message="Récapitulatif"
                    description={
                      <Space direction="vertical">
                        <Text>Prix d'achat: {purchasePriceCFA} FCFA ({purchasePriceEUR} €)</Text>
                        <Text>Dépenses: {depense} FCFA</Text>
                        <Text>Marge: {margeCFA} FCFA ({margeEUR} €)</Text>
                        <Text strong>Prix de vente: {salePrice} FCFA</Text>
                      </Space>
                    }
                    type="info"
                    showIcon
                    className="mb-4"
                  />

                  <Row gutter={16} justify="center">
                    <Col>
                      <Space size="middle">
                        <Button 
                          type="default" 
                          onClick={resetForm}
                          icon={<InfoCircleOutlined />}
                        >
                          Réinitialiser
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          loading={loader}
                          icon={<PlusOutlined />}
                        >
                          Ajouter le produit
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row justify="center" className="mt-3">
            <Col xs={24} sm={24} md={20} lg={18} xl={16}>
              <Card
                className={`${styles.importCsvCard} shadow-sm`}
                bordered={false}
                title={
                  <Title level={5} className="mb-0">
                    Importer des produits depuis un fichier CSV
                  </Title>
                }
              >
                <div className="text-center my-5">
                  <Space direction="vertical" size="large">
                    <Text>
                      Utilisez un fichier CSV pour importer plusieurs produits à la fois.
                      Assurez-vous que votre fichier CSV comporte les colonnes requises.
                    </Text>
                    <Alert
                      message="Format requis"
                      description={
                        <Text>
                          Le fichier CSV doit contenir au minimum les colonnes suivantes:
                          name, quantity, purchase_price, sale_price, product_category_id, 
                          idSupplier, sku, unit_type, etc.
                        </Text>
                      }
                      type="warning"
                      showIcon
                    />
                    <UploadMany urlPath={"product"} />
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Card>
      
      <style jsx>{`
        .shadow-sm {
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        
        .ant-form-item {
          margin-bottom: 16px;
        }
        
        .ant-divider-with-text {
          margin: 16px 0;
          color: #1890ff;
          font-weight: 500;
        }
        
        .ant-tabs-tab {
          padding: 8px 16px !important;
        }
      `}</style>
    </Fragment>
  );
};

export default AddProd;