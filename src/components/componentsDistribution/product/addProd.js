import { PlusOutlined } from "@ant-design/icons";
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
} from "antd";
import { toast } from "react-toastify";

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../redux/reduxDistribution/actions/product/addProductAction";
import { loadAllProductCategory } from "../../../redux/reduxDistribution/actions/productCategory/getProductCategoryAction";
import { loadSuppliers } from "../../../redux/reduxDistribution/actions/supplier/getSuppliersAction";
import UploadMany from "../Card/UploadMany";
import styles from "./AddProd.module.css";

const AddProd = () => {
  const unitType = ["CTN", "AAC", "Nuit","Fun","Moda","Hair","Miscellaneous"];
  const category = useSelector((state) => state.productCategories?.list);
  const allSuppliers = useSelector((state) => state.suppliers.list);
  const dispatch = useDispatch();
  //useEffect for loading category list from redux
  useEffect(() => {
    dispatch(loadAllProductCategory({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSuppliers({ page: 1, limit: 10 }));
  }, []);

  const { Title } = Typography;
  const [fileList, setFileList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sku, setSku] = useState("");
  const [depense, setDepense] = useState(0);
  const [margeCFA, setMargeCFA] = useState(0);
  const [margeEUR, setMargeEUR] = useState(0);
  const [purchasePriceCFA, setPurchasePriceCFA] = useState(0);
  const [purchasePriceEUR, setPurchasePriceEUR] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  const [form] = Form.useForm();

  const EURO_TO_CFA_RATE = 655.957; // Taux de conversion fixe

  const handlePurchasePriceCFAChange = (value) => {
    setPurchasePriceCFA(value);
    setPurchasePriceEUR(value / EURO_TO_CFA_RATE);
  };

  const handlePurchasePriceEURChange = (value) => {
    setPurchasePriceEUR(value);
    setPurchasePriceCFA(value * EURO_TO_CFA_RATE);
  };

  const handleMargeCFAChange = (value) => {
    setMargeCFA(value);
    setMargeEUR(value / EURO_TO_CFA_RATE);
  };

  const handleMargeEURChange = (value) => {
    setMargeEUR(value);
    setMargeCFA(value * EURO_TO_CFA_RATE);
  };

  const onFinish = async (values) => {
    try {
      let formData = new FormData();
      formData.append("image", fileList[0].originFileObj);
      formData.append("name", values.name);
      formData.append("quantity", values.quantity);
      formData.append("purchase_price", purchasePriceCFA);
      formData.append("sale_price", values.sale_price);
      formData.append("product_category_id", values.product_category_id);
      formData.append("idSupplier", values.idSupplier);
      formData.append("sku", sku || values.sku); // use generated sku if available
      formData.append("unit_type", values.unit_type);
      formData.append("reorder_quantity", values.reorder_quantity);
      formData.append("unit_measurement", values.unit_measurement);
      formData.append("collisage", values.collisage);
      formData.append("marge",margeCFA);
      formData.append("gencode",values.gencode);
      formData.append("marque",values.marque);
      formData.append("depense", values.depense);
      formData.append("line_product", values.line_segment);
      formData.append("warehouse", values.warehouse);

      const resp = await dispatch(addProduct(formData));

      if (resp.message === "success") {
        form.resetFields();
        setFileList([]);
        setLoader(false);
        setSku(""); // reset generated sku
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Erreur de création");
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    toast.error("les champs comportant * doivent être remplis");
    console.log("Failed:", errorInfo);
  };

  const handelChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onClickLoading = () => {
    setLoader(true);
  };

  const handleGenerateSku = () => {
    const generatedSku = Math.floor(Math.random() * 900000000) + 100000000;
    const productName = form.getFieldValue("name");
    if (productName) {
      const productNameAbbrev = productName.slice(0, 3).toUpperCase();
      setSku(`ASERM-${productNameAbbrev}${generatedSku.toString()}`);
    } else {
      toast.warn("Veuillez sélectionner un nom avant de générer le SKU!");
    }
  };

  useEffect(() => {
    const calculatedSalePrice = margeCFA - - purchasePriceCFA - - depense; // j'utilise - - car on sait que - * - égale + | le signe + fait plutôt de la concaténation
    setSalePrice(calculatedSalePrice);
    form.setFieldsValue({ sale_price: calculatedSalePrice });
  }, [margeCFA, purchasePriceCFA, depense, form]);

  // console.log("supplier list[ " + allSuppliers + " ]");
  return (
    <Fragment>
      <Row className="mr-top" justify="space-between" gutter={[0, 30]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={11}
          xl={11}
          className="rounded column-design"
        >
          <Card bordered={false}>
            <Title level={4} className="m-2 text-center">
              Ajouter un Produit
            </Title>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 7,
              }}
              labelWrap
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Nom"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom du produit!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Marque"
                name="marque"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la marque du produit!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                name="idSupplier"
                label="Sélectionner un fournisseur "
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
                  placeholder="Sélectionner un fournisseur "
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

              <Form.Item
                style={{ marginBottom: "15px" }}
                name="product_category_id"
                label="Sélectionner une catégorie "
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner la catégorie!",
                  },
                ]}
              >
                <Select
                  name="product_category_id"
                  loading={!category}
                  showSearch
                  placeholder="Sélectionner une catégorie"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
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

              <Form.Item
                style={{ marginBottom: "15px" }}
                name="unit_type"
                label="Sélectionnez la gamme "
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner la gamme !",
                  },
                ]}
              >
                <Select
                  name="unit_type"
                  loading={!category}
                  showSearch
                  placeholder="Sélectionnez la gamme"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {unitType &&
                    unitType.map((unit) => (
                      <Select.Option key={unit} value={unit}>
                        {unit}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
  style={{ marginBottom: "15px" }}
  label="Ligne/Segment"
  name="line_segment"
  rules={[
    {
      required: true,
      message: "Veuillez saisir la Ligne/Segment!",
    },
  ]}
>
  <Input />
</Form.Item>

<Form.Item
  style={{ marginBottom: "15px" }}
  label="Warehouse"
  name="warehouse"
  rules={[
    {
      required: true,
      message: "Veuillez sélectionner le Warehouse!",
    },
  ]}
>
  <Select
    placeholder="Sélectionnez un Warehouse"
    options={[
      { value: "WH1", label: "Italy" },
      { value: "WH2", label: "to be confirmed" },
    ]}
  />
</Form.Item>


              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Collisage"
                name="collisage"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le Collisage!",
                  },
                ]}
              >
                <Input 
                  type="number"
                  min={0} 
                  />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Unité"
                name="unit_measurement"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir l'unité!",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Quantité Commandée"
                name="reorder_quantity"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la Quantité!",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>


              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Quantité Reçue"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la Quantité!",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Prix d'achat (FCFA)"
                name="purchase_price"
                rules={[
                  {
                    message: " Veuillez saisir le Prix d’achat!",
                  },
                ]}
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "100%" }}
                    placeholder="En CFA"
                    type="number"
                    step="0.5"
                    value={purchasePriceCFA}
                    onChange={(e) =>
                      handlePurchasePriceCFAChange(e.target.value)
                    }
                  />
                  
                </Input.Group>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Prix d'achat (€)"
                name="purchase_price"
                rules={[
                  {
                    message: " Veuillez saisir le Prix d’achat!",
                  },
                ]}
              >
                <Input.Group compact>
                  
                  <Input
                    
                    style={{ width: "100%" }}
                    placeholder="En Euros"
                    type="number"
                    step="0.5"
                    value={purchasePriceEUR}
                    onChange={(e) =>
                      handlePurchasePriceEURChange(e.target.value)
                    }
                  />
                </Input.Group>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Dépenses"
                name="depense"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir les dépenses!",
                  },
                ]}
              ><Input 
                type="number"
                min={0}
                onChange={(e) => setDepense(Number(e.target.value))}
                 />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Marge (FCFA)"
                name="marge"
                rules={[
                  {
                    message: " Veuillez saisir la marge!",
                  },
                ]}
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "100%" }}
                    placeholder="En CFA"
                    type="number"
                    step="0.5"
                    value={margeCFA}
                    onChange={(e) =>
                      handleMargeCFAChange(e.target.value)
                    }
                  />
                  
                </Input.Group>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Marge (€)"
                name="marge"
                rules={[
                  {
                    message: " Veuillez saisir la marge!",
                  },
                ]}
              >
                <Input.Group compact>
                  
                  <Input
                    style={{ width: "100%" }}
                    placeholder="En Euros"
                    type="number"
                    step="0.5"
                    value={margeEUR}
                    onChange={(e) =>
                      handleMargeEURChange(e.target.value)
                    }
                  />
                </Input.Group>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Prix de vente"
                name="sale_price"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le Prix de vente!",
                  },
                ]}
              >
                <Input type="number" value={salePrice} readOnly />
              </Form.Item>

              <Form.Item
                label="Envoyer image"
                valuePropName="image"
                rules={[
                  {
                    required: true,
                    message: "Veuillez selectioner une image",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  name="image"
                  fileList={fileList}
                  maxCount={1}
                  onChange={handelChange}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Envoyer
                    </div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Code Produit"
                name="sku"
              >
                <Input
                  value={sku}
                  readOnly
                  addonBefore={sku && sku}
                  maxLength={9}
                  suffix={
                    <Button
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        borderRadius: "4px",
                        marginRight: "5px",
                      }}
                      icon={<PlusOutlined style={{ color: "white" }} />}
                      onClick={handleGenerateSku}
                    />
                  }
                  onChange={(e) => setSku(e.target.value)}
                  onBlur={() => {
                    if (!sku) {
                      handleGenerateSku();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Gencode EAN"
                name="gencode"
                rules={[
                  {
                    required: true,
                    message: " Veuillez saisir le code du produit!",
                  },
                ]}
              >
                <Input type="text"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                className={styles.addProductBtnContainer}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  loading={loader}
                  onClick={onClickLoading}
                >
                  Ajouter un produit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={11} xl={11} className=" rounded">
          <Card className={`${styles.importCsvCard} column-design`}>
            <Title level={4} className="m-2 text-center">
              Importer à partir d’un fichier CSV
            </Title>
            <UploadMany urlPath={"product"} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddProd;
